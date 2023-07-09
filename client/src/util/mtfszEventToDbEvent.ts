import { DbEvent, Rank } from '../api/model/dbEvent'
import { MtfszEvent } from '../api/model/mtfszEvent'
import { stageFilter } from './eventFilter'

export const transformEvent = (e: MtfszEvent): DbEvent => ({
  id: e.esemeny_id,
  name: e.nev_1,
  type: e.tipus,
  startDate: e.datum_tol,
  endDate: e.datum_ig,
  highestRank: getHighestRank(e),
  stages: e.programok.filter(stageFilter).map((p, idx) => ({
    id: p.program_id,
    eventId: e.esemeny_id,
    name: p.nev_1 ?? `${idx + 1}. futam`,
    disciplineId: p.futam.versenytav_id,
    startTime: p.idopont_tol,
    endTime: p.idopont_ig,
    rank: p.futam.rangsorolo as Rank
  })),
  organisers: e.rendezok.map((c) => ({
    id: c.szervezet_id,
    code: c.kod,
    shortName: c.rovid_nev_1,
    longName: c.nev_1
  })),
  rateable: true
})

export const getHighestRank = (e: MtfszEvent): Rank => {
  let highest = Rank.REGIONAL
  e.programok.forEach((p) => {
    if (p.tipus === 'FUTAM') {
      if (p.futam.rangsorolo === 'ORSZAGOS' && highest !== Rank.FEATURED) {
        highest = Rank.NATIONAL
      } else if (p.futam.rangsorolo === 'KIEMELT') {
        highest = Rank.FEATURED
      }
    }
  })
  return highest
}
