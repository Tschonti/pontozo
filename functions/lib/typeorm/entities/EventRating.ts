import { Check, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import CriterionRating from './CriterionRating'
import { RatingRole } from './RatinRole'

export enum RatingStatus {
  STARTED = 'STARTED',
  SUBMITTED = 'SUBMITTED'
}

@Entity()
class EventRating {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  eventId: number

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
