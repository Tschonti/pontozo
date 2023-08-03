import { EventRank, RatingRole, RatingStatus, UserRole } from '@pontozo/common'

type RoleDict = {
  [K in RatingRole]: string
}

type StatusDict = {
  [K in RatingStatus]: string
}

export const translateRole: RoleDict = {
  [RatingRole.COMPETITOR]: 'Versenyző',
  [RatingRole.COACH]: 'Edző',
  [RatingRole.ORGANISER]: 'Rendező',
  [RatingRole.JURY]: 'MTFSZ Zsűri',
}

export const translateStatus: StatusDict = {
  [RatingStatus.STARTED]: 'ELKEZDETT',
  [RatingStatus.SUBMITTED]: 'VÉGLEGESÍTETT',
}

export const statusColor: StatusDict = {
  [RatingStatus.STARTED]: 'orange',
  [RatingStatus.SUBMITTED]: 'brand',
}

type UserRoleDictionary = {
  [K in UserRole]: string
}

export const translateUR: UserRoleDictionary = {
  [UserRole.COACH]: 'Edző',
  [UserRole.SITE_ADMIN]: 'Admin',
  [UserRole.JURY]: 'MTFSZ Zsűri',
}

export const urColor: UserRoleDictionary = {
  [UserRole.COACH]: 'brand',
  [UserRole.SITE_ADMIN]: 'purple',
  [UserRole.JURY]: 'orange',
}

export const getHighestRank = (ranks: EventRank[]) => {
  let highest = EventRank.REGIONAL
  ranks.forEach((r) => {
    if (r === EventRank.FEATURED) {
      highest = EventRank.FEATURED
    } else if (r === EventRank.NATIONAL && highest !== EventRank.FEATURED) {
      highest = EventRank.NATIONAL
    }
  })
  return highest
}

type RankDict = {
  [K in EventRank]: string
}

export const translateRank: RankDict = {
  [EventRank.REGIONAL]: 'REGIONÁLIS',
  [EventRank.NATIONAL]: 'ORSZÁGOS',
  [EventRank.FEATURED]: 'KIEMELT',
  [EventRank.NONE]: 'NEM RANGSOROLÓ',
}

export const rankColor: RankDict = {
  [EventRank.REGIONAL]: 'brand',
  [EventRank.NATIONAL]: 'orange',
  [EventRank.FEATURED]: 'red',
  [EventRank.NONE]: 'gray',
}
