import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import CriterionRating from './CriterionRating'
import Event from './Event'

@Entity()
class Stage {
  @PrimaryColumn()
  id: number

  @ManyToOne(() => Event, (e) => e.stages, { onDelete: 'CASCADE', nullable: false })
  event: Event

  @Column()
  eventId: number

  @Column()
  startTime: string

  @Column({ nullable: true })
  endTime: string

  @Column()
  name: string

  @Column()
  disciplineId: number

  @Column()
  rank: string

  @OneToMany(() => CriterionRating, (cr) => cr.stage, { eager: false, nullable: true, onDelete: 'CASCADE' })
  ratings: CriterionRating[]
}

export default Stage
