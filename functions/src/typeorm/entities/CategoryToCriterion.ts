import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import Category from './Category'
import Criterion from './Criterion'

@Entity()
export class CategoryToCriterion {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  order: number

  @ManyToOne(() => Category, (c) => c.criteria, { nullable: false, onDelete: 'CASCADE' })
  category: Category

  @ManyToOne(() => Criterion, { nullable: false, onDelete: 'CASCADE' })
  criterion: Criterion
}
