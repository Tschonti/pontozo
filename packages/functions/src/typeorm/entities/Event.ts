import { DbEvent } from '@pontozo/common'
import { Check, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import Club from './Club'
import EventRating from './EventRating'
import Season from './Season'
import Stage from './Stage'

enum Rank {
  REGIONAL = 'REGIONALIS',
  NATIONAL = 'ORSZAGOS',
  FEATURED = 'KIEMELT',
}

enum EventState {
  RATEABLE = 'RATEABLE',
  VALIDATING = 'VALIDATING',
  ACCUMULATING = 'ACCUMULATING',
  RESULTS_READY = 'RESULTS_READY',
  INVALIDATED = 'INVALIDATED',
}

@Entity()
class Event implements DbEvent {
  @PrimaryColumn()
  id: number

  @Column()
  name: string

  @Column()
  type: string

  @Column()
  startDate: string

  @Column({ nullable: true })
  endDate?: string

  @OneToMany(() => Stage, (s) => s.event, { eager: false, cascade: true })
  stages: Stage[]

  @OneToMany(() => EventRating, (er) => er.event, { eager: false })
  ratings: EventRating[]

  @Column({ default: EventState.RATEABLE })
  @Check("state in('RATEABLE', 'VALIDATING', 'ACCUMULATING', 'RESULTS_READY', 'INVALIDATED')")
  state: EventState

  @Column()
  @Check("highestRank in('REGIONALIS', 'ORSZAGOS', 'KIEMELT')")
  highestRank: Rank

  @ManyToMany(() => Club, (c) => c.events, { cascade: true })
  @JoinTable()
  organisers: Club[]

  @ManyToOne(() => Season, (s) => s.events, { eager: false, onDelete: 'CASCADE' })
  season: Season

  @Column()
  seasonId: number

  @Column({ type: 'datetime', nullable: true })
  scoresCalculatedAt?: Date

  @Column({ default: 0 })
  totalRatingCount: number
}

export default Event
