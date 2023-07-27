import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import Criterion from './Criterion'
import EventRating from './EventRating'
import Stage from './Stage'
import { CriterionRating as ICriterionRating } from '@pontozo/common'

@Entity()
@Unique(['criterionId', 'eventRatingId', 'stageId'])
class CriterionRating implements ICriterionRating {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Criterion, (c) => c.ratings, { onDelete: 'CASCADE', nullable: false })
  criterion: Criterion

  @Column()
  criterionId: number

  @ManyToOne(() => EventRating, (er) => er.ratings, { onDelete: 'CASCADE', nullable: false })
  eventRating: EventRating

  @Column()
  eventRatingId: number

  @Column({ nullable: true })
  stageId?: number

  @ManyToOne(() => Stage, (s) => s.ratings, { onDelete: 'NO ACTION', nullable: true })
  stage?: Stage

  @Column()
  value: number
}

export default CriterionRating
