import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import EventToClub from './EventToClub'

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

  @OneToMany(() => EventToClub, (etc) => etc.club, { cascade: true })
  events: EventToClub[]
}

export default Club
