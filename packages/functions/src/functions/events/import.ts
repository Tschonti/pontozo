import { app, InvocationContext, Timer } from '@azure/functions'
import { AlertLevel, EventImportedNotificationOptions, getHighestRank, getRateableEvents, Rank, stageFilter } from '@pontozo/common'
import { IsNull, Not } from 'typeorm'
import { newAlertItem } from '../../service/alert.service'
import { sendEventImportEmail } from '../../service/email.service'
import Club from '../../typeorm/entities/Club'
import { EmailRecipient } from '../../typeorm/entities/EmailRecipient'
import Event from '../../typeorm/entities/Event'
import Season from '../../typeorm/entities/Season'
import Stage from '../../typeorm/entities/Stage'
import { getAppDataSource } from '../../typeorm/getConfig'
import { currentSeasonFilter } from '../../util/currentSeasonFilter'
import { APIM_HOST, APIM_KEY } from '../../util/env'

/**
 * Called every noon automatically to import events from MTFSZ DB.
 */
export const importEvents = async (myTimer: Timer, context: InvocationContext): Promise<void> => {
  try {
    const ads = await getAppDataSource(context)

    const eventRepo = ads.getRepository(Event)
    const stageRepo = ads.getRepository(Stage)
    const clubRepo = ads.getRepository(Club)
    const seasonRepo = ads.getRepository(Season)
    const emailRepo = ads.getRepository(EmailRecipient)

    const season = await seasonRepo.findOne({ where: currentSeasonFilter })
    if (season === null) {
      context.log('No active season, skipping event import...')
      return
    }

    const [events, eventsOfTheSeason] = await Promise.all([
      getRateableEvents(APIM_KEY, APIM_HOST),
      eventRepo.find({ where: { seasonId: season.id } }),
    ])
    const eventIdsOfTheSeason = eventsOfTheSeason.map((e) => e.id)
    const eventsToSave = events
      .filter((e) => new Date(new Date(e.datum_tol).setHours(23)) > season.startDate && !eventIdsOfTheSeason.includes(e.esemeny_id))
      .map((e) => {
        const event = eventRepo.create({
          id: e.esemeny_id,
          name: e.nev_1,
          type: e.tipus,
          startDate: e.datum_tol,
          endDate: e.datum_ig,
          highestRank: getHighestRank(e),
          seasonId: season.id,
          stages: [],
          organisers: [],
        })

        event.stages.push(
          ...e.programok.filter(stageFilter).map((s, idx) =>
            stageRepo.create({
              id: s.program_id,
              eventId: event.id,
              name: s.nev_1 ?? `${idx + 1}. futam`,
              disciplineId: s.futam.versenytav_id,
              startTime: s.idopont_tol,
              endTime: s.idopont_ig,
              rank: s.futam.rangsorolo,
            })
          )
        )

        event.organisers.push(
          ...e.rendezok.map((o) =>
            clubRepo.create({
              id: o.szervezet_id,
              code: o.kod,
              shortName: o.rovid_nev_1,
              longName: o.nev_1,
            })
          )
        )
        return event
      })

    await eventRepo.save(eventsToSave)

    if (eventsToSave.length > 0) {
      await newAlertItem({ ads, context, desc: `${eventsToSave.length} events imported` })

      const emailRecipients = await emailRepo.find({
        where: { eventImportedNotifications: Not(EventImportedNotificationOptions.NONE), restricted: false, email: Not(IsNull()) },
      })
      const nationalEvents = eventsToSave.filter((e) => e.highestRank !== Rank.REGIONAL)
      const responses = await Promise.all(
        emailRecipients.map((er) =>
          sendEventImportEmail(
            er,
            er.eventImportedNotifications === EventImportedNotificationOptions.ALL ? eventsToSave : nationalEvents,
            context
          )
        )
      )
      if (responses.some((r) => !r)) {
        const emailsToRestrict = emailRecipients
          .filter((_, idx) => !responses[idx])
          .map((user) => {
            newAlertItem({ context, desc: `Failed to send email to ${user.email}`, level: AlertLevel.WARN })
            user.restricted = true
            return user
          })
        await emailRepo.save(emailsToRestrict)
      }
    }
  } catch (error) {
    await newAlertItem({ context, desc: `Error during event import: ${error}`, level: AlertLevel.ERROR })
  }
}

app.timer('events-import', {
  schedule: '0 0 12 * * *', // 12 PM every day (noon)
  handler: importEvents,
  runOnStartup: false,
})
