import { EventSection, MtfszEvent } from '../types/mtfszEvents'
import { acceptedRanks } from './ranks'

export const eventFilter = (e: MtfszEvent) =>
  e.tipus === 'VERSENY' && e.programok.some(stageFilter) && (!e.datum_ig || new Date() > new Date(e.datum_ig))

export const stageFilter = (s: EventSection) => s.tipus === 'FUTAM' && acceptedRanks.includes(s.futam.rangsorolo)
