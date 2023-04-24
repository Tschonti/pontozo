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

  @Column({ nullable: true })
  text0: string

  @Column({ nullable: true })
  text1: string

  @Column({ nullable: true })
  text2: string

  @Column({ nullable: true })
  text3: string

  @Column({ nullable: true })
  editorsNote: string

  @Column()
  nationalOnly: boolean

  @Column()
  stageSpecific: boolean

  @Column({ nullable: true })
  competitorWeight: number

  @Column({ nullable: true })
  organiserWeight: number

  @OneToMany(() => Rating, (r) => r.criterion, { eager: false })
  ratings: Rating[]

  @Column({
    type: 'nvarchar'
  })
  roles: string
}

export default Criterion
