import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import Criterion from './Criterion'
import EventRating from './EventRating'

@Entity()
@Unique(['criterion', 'eventRating', 'stageId'])
class CriterionRating {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Criterion, (c) => c.ratings, { onDelete: 'CASCADE', nullable: false })
  criterion: Criterion

  @ManyToOne(() => EventRating, (er) => er.ratings, { onDelete: 'CASCADE', nullable: false })
  eventRating: EventRating

  @Column({ nullable: true })
  stageId: number

  @Column()
  value: number
}

export default CriterionRating
