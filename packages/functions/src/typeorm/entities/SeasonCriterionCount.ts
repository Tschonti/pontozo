import { Check, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { RatingRole } from './EventRating'
import Season from './Season'

@Entity()
@Unique(['role', 'seasonId'])
class SeasonCriterionCount {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Season, (s) => s.criterionCount, { eager: false, onDelete: 'CASCADE' })
  season: Season

  @Column()
  seasonId: number

  @Column()
  @Check("role in('COMPETITOR', 'COACH', 'ORGANISER', 'JURY')")
  role: RatingRole

  @Column()
  eventSpecificAnyRank: number

  @Column()
  eventSpecificHigherRank: number

  @Column()
  stageSpecificAnyRank: number

  @Column()
  stageSpecificHigherRank: number
}

export default SeasonCriterionCount
