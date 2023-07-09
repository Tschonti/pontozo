import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import Event from './Event'
import { SeasonToCategory } from './SeasonToCategory'

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

  @OneToMany(() => SeasonToCategory, (ctc) => ctc.season, { cascade: true })
  categories: SeasonToCategory[]

  @OneToMany(() => Event, (e) => e.season)
  events: Event[]
}

export default Season
