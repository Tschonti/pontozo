import { Criterion as ICriterion } from '@pontozo/common'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { CategoryToCriterion } from './CategoryToCriterion'
import CriterionRating from './CriterionRating'
import { CriterionWeight } from './CriterionWeight'
import { RatingResult } from './RatingResult'

@Entity()
class Criterion implements Omit<ICriterion, 'roles'> {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column({ nullable: true })
  text0?: string

  @Column({ nullable: true })
  text1?: string

  @Column({ nullable: true })
  text2?: string

  @Column({ nullable: true })
  text3?: string

  @Column({ nullable: true })
  editorsNote?: string

  @Column()
  nationalOnly: boolean

  @Column()
  stageSpecific: boolean

  @Column()
  allowEmpty: boolean

  @OneToMany(() => CriterionRating, (r) => r.criterion, { eager: false })
  ratings: CriterionRating[]

  @OneToMany(() => RatingResult, (r) => r.criterion, { eager: false })
  ratingResults: RatingResult[]

  @Column({
    type: 'nvarchar',
  })
  roles: string

  @OneToMany(() => CategoryToCriterion, (ctc) => ctc.criterion, { cascade: true })
  categories: CategoryToCriterion[]

  @OneToMany(() => CriterionWeight, (w) => w.criterion, { eager: false })
  weights: CriterionWeight[]
}

export default Criterion
