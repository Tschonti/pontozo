import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import Event from './Event'
import { SeasonToCategory } from './SeasonToCategory'
import { Season as ISeason } from '@pontozo/types'

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
}

export default Season