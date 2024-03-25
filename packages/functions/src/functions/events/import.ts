import { app, InvocationContext, Timer } from '@azure/functions'
import { getHighestRank, getRateableEvents, stageFilter } from '@pontozo/common'
import { newAlertItem } from '../../service/alert.service'
import Club from '../../typeorm/entities/Club'
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
    const pevents = getRateableEvents(APIM_KEY, APIM_HOST)
    const pads = getAppDataSource(context)
    const [events, ads] = await Promise.all([pevents, pads])

    const eventRepo = ads.getRepository(Event)
    const stageRepo = ads.getRepository(Stage)
    const clubRepo = ads.getRepository(Club)
    const seasonRepo = ads.getRepository(Season)

    const season = await seasonRepo.findOne({ where: currentSeasonFilter })
    if (season === null) {
      context.log('No active season, skipping event import...')
      return
    }
    const eventCountBefore = await eventRepo.count()
    const eventsToSave = events.map((e) => {
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

    const eventCountAfter = await eventRepo.count()
    const created = eventCountAfter - eventCountBefore
    newAlertItem({ ads, context, desc: `${created} events created, ${eventsToSave.length - created} updated in db` })
  } catch (error) {
    context.log(error)
  }
}

app.timer('events-import', {
  schedule: '0 0 12 * * *', // 12 PM every day (noon)
  handler: importEvents,
  runOnStartup: false,
})
