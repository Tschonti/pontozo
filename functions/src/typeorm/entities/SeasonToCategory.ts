import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import Category from './Category'
import Season from './Season'

@Entity()
export class SeasonToCategory {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  order: number

  @ManyToOne(() => Season, (s) => s.categories, { nullable: false, onDelete: 'CASCADE' })
  season: Season

  @ManyToOne(() => Category, { nullable: false, onDelete: 'CASCADE' })
  category: Category
}
