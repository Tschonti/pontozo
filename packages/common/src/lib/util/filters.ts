import { MtfszEvent, EventSection } from '../types/mtfszEvents'
import { acceptedRanks } from './ranks'

export const eventFilter = (e: MtfszEvent) =>
  e.tipus === 'VERSENY' &&
  e.programok.some((p) => p.tipus === 'FUTAM' && p.futam.szakag === 'TAJFUTAS' && acceptedRanks.includes(p.futam.rangsorolo))

export const stageFilter = (s: EventSection) => s.tipus === 'FUTAM' && acceptedRanks.includes(s.futam.rangsorolo)
