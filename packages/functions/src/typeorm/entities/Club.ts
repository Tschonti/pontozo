import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm'
import Event from './Event'

@Entity()
class Club {
  @PrimaryColumn()
  id: number

  @Column()
  code: string

  @Column()
  shortName: string

  @Column()
  longName: string

  @ManyToMany(() => Event, (c) => c.organisers)
  events: Event[]
}

export default Club
