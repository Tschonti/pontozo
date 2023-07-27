import { DbEvent, Rank } from '../types/dbEvents'
import { MtfszEvent } from '../types/mtfszEvents'

export const acceptedRanks = ['REGIONALIS', 'ORSZAGOS', 'KIEMELT']
export const higherRanks = ['ORSZAGOS', 'KIEMELT']

export const isHigherRank = (e: DbEvent) => {
  return higherRanks.includes(e.highestRank)
}

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
