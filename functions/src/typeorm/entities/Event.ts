import { Check, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import EventRating from './EventRating'
import EventToClub from './EventToClub'
import Stage from './Stage'

export enum Rank {
  REGIONAL = 'REGIONALIS',
  NATIONAL = 'ORSZAGOS',
  FEATURED = 'KIEMELT'
}

@Entity()
class Event {
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

  @OneToMany(() => Stage, (s) => s.event, { eager: false })
  stages: Stage[]

  @OneToMany(() => EventRating, (er) => er.event, { eager: false })
  ratings: EventRating[]

  @Column({ default: true })
  rateable: boolean

  @Column()
  @Check("highestRank in('REGIONALIS', 'ORSZAGOS', 'KIEMELT')")
  highestRank: Rank

  @OneToMany(() => EventToClub, (etc) => etc.event, { cascade: true })
  organisers: EventToClub[]
}

export default Event
