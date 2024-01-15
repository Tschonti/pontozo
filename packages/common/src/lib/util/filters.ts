import { EventSection, MtfszEvent } from '../types/mtfszEvents'
import { acceptedRanks } from './enumHelpers'

export const eventFilter = (e: MtfszEvent) =>
  e.tipus === 'VERSENY' && e.programok.some(rankedStageFilter) && (!e.datum_ig || new Date() > new Date(e.datum_ig))

export const rankedStageFilter = (s: EventSection) => s.tipus === 'FUTAM' && acceptedRanks.includes(s.futam.rangsorolo)
export const stageFilter = (s: EventSection) => s.tipus === 'FUTAM'
