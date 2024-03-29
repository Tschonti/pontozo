import { Category as ICategory } from '@pontozo/common'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { CategoryToCriterion } from './CategoryToCriterion'
import { RatingResult } from './RatingResult'
import { SeasonToCategory } from './SeasonToCategory'

@Entity()
class Category implements ICategory {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @OneToMany(() => CategoryToCriterion, (ctc) => ctc.category, { cascade: true })
  criteria: CategoryToCriterion[]

  @OneToMany(() => SeasonToCategory, (ctc) => ctc.category, { cascade: true })
  seasons: SeasonToCategory[]

  @OneToMany(() => RatingResult, (r) => r.criterion, { eager: false })
  ratingResults: RatingResult[]
}

export default Category
