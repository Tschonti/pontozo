import { Criterion, CriterionDetails } from './criterion'

export interface Category {
  id: number
  name: string
  description: string
}

export interface CategoryDetails extends Category {
  criteria: Criterion[]
}

export interface CreateCategory extends Omit<Category, 'id'> {
  criterionIds: number[]
}

export interface CreateCategoryForm extends Omit<CategoryDetails, 'id'> {}

export interface CategoryWithCriteria extends Category {
  criteria: CriterionDetails[]
}
