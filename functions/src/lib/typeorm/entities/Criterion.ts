import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import Rating from './CriterionRating'

@Entity()
class Criterion {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  minValue: number

  @Column()
  maxValue: number

  @Column()
  weight: number

  @OneToMany(() => Rating, (r) => r.criterion, { eager: true })
  ratings: Rating[]

  @Column({
    type: 'nvarchar'
  })
  roles: string
}

export default Criterion
