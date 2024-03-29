import { Category as ICategory } from '@pontozo/common'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { CategoryToCriterion } from './CategoryToCriterion'
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
}

export default Category
