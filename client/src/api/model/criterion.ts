import { CriterionRating, RatingRole } from './rating'

export interface Criterion {
  id: number
  name: string
  description: string
  text0: string
  text1: string
  text2: string
  text3: string
  editorsNote: string
  competitorWeight: number
  organiserWeight: number
  stageSpecific: boolean
  nationalOnly: boolean
  roles: RatingRole[]
}

export interface CriterionDetails extends Criterion {
  rating?: CriterionRating
}

export type CreateCriterion = Omit<Criterion, 'id'>
