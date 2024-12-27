import { CriterionWeight as ICriterionWeight } from '@pontozo/common'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import Criterion from './Criterion'
import Season from './Season'

@Entity()
export class CriterionWeight implements ICriterionWeight {
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

  @Column({ nullable: true, type: 'float' })
  competitorWeight?: number

  @Column({ nullable: true, type: 'float' })
  organiserWeight?: number
}
