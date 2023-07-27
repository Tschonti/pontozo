import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { CategoryToCriterion } from './CategoryToCriterion'
import CriterionRating from './CriterionRating'
import { Criterion as ICriterion } from '@pontozo/common'

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

  @Column({ nullable: true })
  competitorWeight: number

  @Column({ nullable: true })
  organiserWeight: number

  @OneToMany(() => CriterionRating, (r) => r.criterion, { eager: false })
  ratings: CriterionRating[]

  @Column({
    type: 'nvarchar',
  })
  roles: string

  @OneToMany(() => CategoryToCriterion, (ctc) => ctc.criterion, { cascade: true })
  categories: CategoryToCriterion[]
}

export default Criterion
