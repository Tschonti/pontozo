import { RatingRole } from '../api/model/rating'

export const ratingRolesArray = [RatingRole.COMPETITOR, RatingRole.COACH, RatingRole.ORGANISER, RatingRole.JURY]

type RoleDict = {
  [K in RatingRole]: string
}

export const translateRole: RoleDict = {
  [RatingRole.COMPETITOR]: 'Versenyző',
  [RatingRole.COACH]: 'Edző',
  [RatingRole.ORGANISER]: 'Rendező',
  [RatingRole.JURY]: 'MTFSZ Zsűri'
}
