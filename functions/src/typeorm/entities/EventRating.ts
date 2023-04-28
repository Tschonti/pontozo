import { Check, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import CriterionRating from './CriterionRating'

export enum RatingStatus {
  STARTED = 'STARTED',
  SUBMITTED = 'SUBMITTED'
}

export enum RatingRole {
  COMPETITOR = 'COMPETITOR',
  COACH = 'COACH',
  ORGANISER = 'ORGANISER',
  JURY = 'JURY'
}

@Entity()
class EventRating {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  eventId: number

  @Column()
  userId: number

  @OneToMany(() => CriterionRating, (cr) => cr.eventRating, { onDelete: 'CASCADE', nullable: false })
  ratings: CriterionRating

  @Column({ default: RatingStatus.STARTED })
  @Check("status in('STARTED', 'SUBMITTED')")
  status: RatingStatus

  @Column()
  @Check("role in('COMPETITOR', 'COACH', 'ORGANISER', 'JURY')")
  role: RatingRole

  @Column({ type: 'datetime' })
  createdAt: Date

  @Column({ type: 'datetime', nullable: true })
  submittedAt?: Date
}

export default EventRating
