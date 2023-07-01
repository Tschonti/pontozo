import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import Club from './Club'
import Event from './Event'

@Entity()
class EventToClub {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  eventId: number

  @ManyToOne(() => Event, (e) => e.organisers, { nullable: false, onDelete: 'CASCADE' })
  event: Event

  @Column()
  clubId: number

  @ManyToOne(() => Club, (c) => c.events, { nullable: false, onDelete: 'CASCADE' })
  club: Club
}

export default EventToClub
