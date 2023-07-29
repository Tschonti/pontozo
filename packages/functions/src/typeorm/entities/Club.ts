import { Club as IClub } from '@pontozo/common'
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm'
import Event from './Event'

@Entity()
class Club implements IClub {
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
