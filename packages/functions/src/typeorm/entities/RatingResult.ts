import { RatingResult as IRatingResult } from '@pontozo/common'
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import Category from './Category'
import Criterion from './Criterion'
import Event from './Event'
import Stage from './Stage'

@Entity()
export class RatingResult implements Omit<IRatingResult, 'items'> {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  parentId?: number

  @ManyToOne(() => RatingResult, (c) => c.children, { onDelete: 'NO ACTION', nullable: true })
  parent?: RatingResult

  @OneToMany(() => RatingResult, (r) => r.parent, { eager: false, onDelete: 'NO ACTION' })
  children: RatingResult[]

  @Column()
  eventId: number

  @ManyToOne(() => Event, (e) => e.ratings, { onDelete: 'CASCADE', nullable: false })
  event: Event

  @Column({ nullable: true })
  stageId?: number

  @ManyToOne(() => Stage, (s) => s.ratings, { onDelete: 'NO ACTION', nullable: true })
  stage?: Stage

  @Column({ nullable: true })
  criterionId?: number

  @ManyToOne(() => Criterion, (c) => c.ratingResults, { onDelete: 'CASCADE', nullable: true })
  criterion?: Criterion

  @Column({ nullable: true })
  categoryId?: number

  @ManyToOne(() => Category, (c) => c.ratingResults, { onDelete: 'CASCADE', nullable: true })
  category?: Category

  @Column({ type: 'text' })
  items: string
}
