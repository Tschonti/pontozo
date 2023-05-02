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

export interface CreateCriterion extends Omit<Criterion, 'id' | 'competitorWeight' | 'organiserWeight'> {
  organiserWeight?: number
  competitorWeight?: number
}

export interface CreateCriterionForm extends Omit<Criterion, 'id' | 'roles'> {
  competitorAllowed: boolean
  juryAllowed: boolean
}
