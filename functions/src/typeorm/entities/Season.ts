import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import Category from './Category'

@Entity()
class Season {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  startDate: Date

  @Column()
  endDate: Date

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[]
}

export default Season
