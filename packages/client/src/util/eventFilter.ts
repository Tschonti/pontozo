import { EventSection, MtfszEvent } from "@pontozo/types"

const acceptedGrades = ['REGIONALIS', 'ORSZAGOS', 'KIEMELT']

export const eventFilter = (e: MtfszEvent) =>
  e.tipus === 'VERSENY' &&
  e.programok.some((p) => p.tipus === 'FUTAM' && p.futam.szakag === 'TAJFUTAS' && acceptedGrades.includes(p.futam.rangsorolo))

export const stageFilter = (s: EventSection) => s.tipus === 'FUTAM' && acceptedGrades.includes(s.futam.rangsorolo)
