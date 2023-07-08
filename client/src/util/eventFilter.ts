import { MtfszEvent } from '../api/model/mtfszEvent'

const acceptedGrades = ['REGIONALIS', 'ORSZAGOS', 'KIEMELT']

export const eventFilter = (e: MtfszEvent) =>
  e.tipus === 'VERSENY' &&
  e.programok.some((p) => p.tipus === 'FUTAM' && p.futam.szakag === 'TAJFUTAS' && acceptedGrades.includes(p.futam.rangsorolo))
