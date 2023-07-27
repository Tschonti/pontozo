import { MtfszUser, UserPreview, DbEvent, MtfszEvent, Rank, getHighestRank, stageFilter } from '@pontozo/types'

export const transformUser = (u: MtfszUser): UserPreview => ({
  userDOB: u.szul_dat,
  userFullName: u.vezeteknev + ' ' + u.keresztnev,
  userId: u.szemely_id,
})

export const transformEvent = (e: MtfszEvent): DbEvent => ({
  id: e.esemeny_id,
  seasonId: -1,
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
    rank: p.futam.rangsorolo as Rank,
  })),
  organisers: e.rendezok.map((c) => ({
    id: c.szervezet_id,
    code: c.kod,
    shortName: c.rovid_nev_1,
    longName: c.nev_1,
  })),
  rateable: true,
})
