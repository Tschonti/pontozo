import { AgeGroup, AlertLevel, EventRank, EventState, RatingRole, RatingStatus, UserRole } from '@pontozo/common'

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

export const getRoleDescription: RoleDict = {
  [RatingRole.COMPETITOR]: 'A versenyen elindult versenyző. Nem kell, hogy érvényes eredményed legyen, elég ha neveztél és rajthoz álltál.',
  [RatingRole.COACH]:
    'Ha az MTFSZ felvett téged az edzők listájára, ebben a szerepkörben a tanítványaid elmondása alapján akkor is értékelheted a versenyt, ha nem indultál el rajta.',
  [RatingRole.ORGANISER]:
    'A versenyen rendezőként vettél részt, emiatt nagyobb rálátásod volt a versenyre, így több szempont alapján értékelheted.',
  [RatingRole.JURY]:
    'Az MTFSZ által kijelölt zsűrik választhatják, akiknek nagyobb rálátásuk volt a versenyre, így több szempont alapján értékelhetnek.',
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

type AgeGroupDictionary = {
  [K in AgeGroup]: string
}

export const translateAgeGroup: AgeGroupDictionary = {
  [AgeGroup.YOUTH]: 'Utánpótlás',
  [AgeGroup.ELITE]: 'Felnőtt',
  [AgeGroup.MASTER]: 'Szenior',
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

type AlertDict = {
  [K in AlertLevel]: 'info' | 'warning' | 'error'
}

export const alertLevelToChakraStatus: AlertDict = {
  [AlertLevel.INFO]: 'info',
  [AlertLevel.WARN]: 'warning',
  [AlertLevel.ERROR]: 'error',
}

type EventStateDict = {
  [K in EventState]: string
}

export const translateEventState: EventStateDict = {
  [EventState.RATEABLE]: 'ÉRTÉKELHETŐ',
  [EventState.VALIDATING]: 'VALIDÁCIÓ FOLYAMATBAN',
  [EventState.ACCUMULATING]: 'ÖSSZEGZÉS FOLYAMATBAN',
  [EventState.RESULTS_READY]: 'VÉGLEGES EREDMÉNY',
  [EventState.INVALIDATED]: 'ÉRVÉNYTELENÍTETT',
}

export const eventStateColor: EventStateDict = {
  [EventState.RATEABLE]: 'brand',
  [EventState.VALIDATING]: 'gray',
  [EventState.ACCUMULATING]: 'gray',
  [EventState.RESULTS_READY]: 'orange',
  [EventState.INVALIDATED]: 'yellow',
}
