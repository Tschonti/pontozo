import { DbStage } from '@pontozo/common'
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import CriterionRating from './CriterionRating'
import Event from './Event'
import EventRating from './EventRating'

@Entity()
class Stage implements DbStage {
  @PrimaryColumn()
  id: number

  @ManyToOne(() => Event, (e) => e.stages, { onDelete: 'CASCADE', nullable: false })
  event: Event

  @Column()
  eventId: number

  @Column()
  startTime: string

  @Column({ nullable: true })
  endTime: string

  @Column()
  name: string

  @Column()
  disciplineId: number

  @Column()
  rank: string

  @OneToMany(() => CriterionRating, (cr) => cr.stage, { eager: false, nullable: true, onDelete: 'CASCADE' })
  ratings: CriterionRating[]

  @ManyToMany(() => EventRating, (er) => er.stages)
  eventRatings: EventRating[]
}

export default Stage
