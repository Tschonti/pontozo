import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import Criterion from './Criterion'
import Season from './Season'

@Entity()
export class CriterionWeight {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Criterion, (c) => c.weights, { onDelete: 'CASCADE', nullable: false })
  criterion: Criterion

  @Column()
  criterionId: number

  @ManyToOne(() => Season, (s) => s.criterionWeights, { onDelete: 'CASCADE', nullable: false })
  season: Season

  @Column()
  seasonId: number

  competitorWeight?: number

  organiserWeight?: number
}
