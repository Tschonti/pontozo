import Category from '../../../typeorm/entities/Category'
import Criterion from '../../../typeorm/entities/Criterion'

export interface CategoryWithCriteria extends Omit<Category, 'criteria'> {
  criteria: Criterion[]
}
