import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { CategoryToCriterion } from './CategoryToCriterion'

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @OneToMany(() => CategoryToCriterion, (ctc) => ctc.category, { cascade: true })
  criteria: CategoryToCriterion[]
}

export default Category
