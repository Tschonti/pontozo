import { EventRating as IEventRating } from '@pontozo/common'
import { Check, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import CriterionRating from './CriterionRating'
import Event from './Event'
import Stage from './Stage'

enum RatingStatus {
  STARTED = 'STARTED',
  SUBMITTED = 'SUBMITTED',
}

export enum RatingRole {
  COMPETITOR = 'COMPETITOR',
  COACH = 'COACH',
  ORGANISER = 'ORGANISER',
  JURY = 'JURY',
}

@Entity()
class EventRating implements IEventRating {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  eventId: number

  @ManyToOne(() => Event, (e) => e.ratings, { onDelete: 'CASCADE', nullable: false })
  event: Event

  @Column()
  userId: number

  @OneToMany(() => CriterionRating, (cr) => cr.eventRating, { onDelete: 'CASCADE', nullable: false })
  ratings: CriterionRating[]

  @Column({ default: RatingStatus.STARTED })
  @Check("status in('STARTED', 'SUBMITTED')")
  status: RatingStatus

  @Column()
  @Check("role in('COMPETITOR', 'COACH', 'ORGANISER', 'JURY')")
  role: RatingRole

  @Column({ default: 0 })
  currentCategoryIdx: number

  @Column({ default: -1 })
  currentStageIdx: number

  @ManyToMany(() => Stage, (s) => s.eventRatings)
  @JoinTable()
  stages: Stage[]

  @Column({ type: 'datetime' })
  createdAt: Date

  @Column({ type: 'datetime', nullable: true })
  submittedAt?: Date
}

export default EventRating
