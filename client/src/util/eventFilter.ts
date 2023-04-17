import { Event } from '../api/model/event'

const acceptedGrades = ['REGIONALIS', 'ORSZAGOS', 'KIEMELT']

export const eventFilter = (e: Event) =>
  e.tipus === 'VERSENY' &&
  e.programok.some((p) => p.tipus === 'FUTAM' && p.futam.szakag === 'TAJFUTAS' && acceptedGrades.includes(p.futam.rangsorolo))
