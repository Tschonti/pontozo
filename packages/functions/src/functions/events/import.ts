import { app, InvocationContext, Timer } from '@azure/functions'
import { getRateableEvents, stageFilter } from '../../service/mtfsz.service'
import Club from '../../typeorm/entities/Club'
import Event from '../../typeorm/entities/Event'
import Season from '../../typeorm/entities/Season'
import Stage from '../../typeorm/entities/Stage'
import { getAppDataSource } from '../../typeorm/getConfig'
import { currentSeasonFilter } from '../../util/currentSeasonFilter'
import { getHighestRank } from '../../util/getHighestRank'

/**
 * Called every night automatically to import events from MTFSZ DB.
 */
export const importEvents = async (myTimer: Timer, context: InvocationContext): Promise<void> => {
  const pevents = getRateableEvents()
  const pads = getAppDataSource()
  const [events, ads] = await Promise.all([pevents, pads])

  const eventRepo = ads.getRepository(Event)
  const stageRepo = ads.getRepository(Stage)
  const clubRepo = ads.getRepository(Club)
  const seasonRepo = ads.getRepository(Season)

  const season = await seasonRepo.findOne({ where: currentSeasonFilter })
  if (season === null) {
    return
  }

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
}

app.timer('events-import', {
  schedule: '0 1 * * *', // 1 AM every day
  handler: importEvents,
})
