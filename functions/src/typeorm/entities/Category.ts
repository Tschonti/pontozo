import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import Criterion from './Criterion'

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @ManyToMany(() => Criterion)
  @JoinTable()
  criteria: Criterion[]
}

export default Category
