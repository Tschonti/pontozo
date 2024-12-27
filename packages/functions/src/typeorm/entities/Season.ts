import { Season as ISeason } from '@pontozo/common'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { CriterionWeight } from './CriterionWeight'
import Event from './Event'
import SeasonCriterionCount from './SeasonCriterionCount'
import { SeasonToCategory } from './SeasonToCategory'

@Entity()
class Season implements ISeason {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  startDate: Date

  @Column()
  endDate: Date

  @OneToMany(() => SeasonToCategory, (ctc) => ctc.season, { cascade: true })
  categories: SeasonToCategory[]

  @OneToMany(() => Event, (e) => e.season)
  events: Event[]

  @OneToMany(() => SeasonCriterionCount, (scc) => scc.season)
  criterionCount: SeasonCriterionCount[]

  @OneToMany(() => CriterionWeight, (w) => w.season, { eager: false })
  criterionWeights: CriterionWeight[]
}

export default Season
