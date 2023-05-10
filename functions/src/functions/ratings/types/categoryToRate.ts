import Category from '../../../typeorm/entities/Category'
import { CriterionToRate } from './criterionToRate.dto'

export interface CategoryToRate extends Omit<Category, 'criteria'> {
  criteria: CriterionToRate[]
}
