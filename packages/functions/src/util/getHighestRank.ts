import { MtfszEvent, Rank } from '@pontozo/types'

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
