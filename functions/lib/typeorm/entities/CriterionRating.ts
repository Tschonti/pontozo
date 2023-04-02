import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import Criterion from './Criterion'
import EventRating from './EventRating'

@Entity()
class CriterionRating {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Criterion, (c) => c.ratings, { onDelete: 'CASCADE', nullable: false })
  criterion: Criterion

  @ManyToOne(() => EventRating, (er) => er.ratings, { onDelete: 'CASCADE', nullable: false })
  eventRating: EventRating

  @Column()
  value: number
}

export default CriterionRating
