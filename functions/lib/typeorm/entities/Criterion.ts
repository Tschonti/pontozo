import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import Rating from './CriterionRating'
import { RatingRole } from './RatinRole'

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
  roles: RatingRole[]
}

export default Criterion
