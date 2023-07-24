import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm'

export const currentSeasonFilter = { startDate: LessThanOrEqual(new Date()), endDate: MoreThanOrEqual(new Date()) }
