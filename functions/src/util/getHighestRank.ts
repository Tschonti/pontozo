import { Event } from '../service/types'
import { Rank } from '../typeorm/entities/Event'

export const getHighestRank = (e: Event): Rank => {
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
