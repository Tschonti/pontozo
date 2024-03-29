import { DbEvent, Rank } from '../types/dbEvents'
import { EventRating, RatingRole } from '../types/eventRatings'
import { MtfszEvent } from '../types/mtfszEvents'
import { AgeGroup } from '../types/users'

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

export const ALL_ROLES = [RatingRole.COMPETITOR, RatingRole.COACH, RatingRole.ORGANISER, RatingRole.JURY]
export const ALL_AGE_GROUPS = [AgeGroup.YOUTH, AgeGroup.ELITE, AgeGroup.MASTER]

export const ageGroupFilterDict: { [G in AgeGroup]: (er: EventRating) => boolean } = {
  YOUTH: (er) => er.raterAge < 21,
  ELITE: (er) => er.raterAge > 20 && er.raterAge < 35,
  MASTER: (er) => er.raterAge > 34,
}
