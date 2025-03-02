import { EmailRecipient as IEmailRecipient } from '@pontozo/common'
import { Check, Column, Entity, PrimaryColumn } from 'typeorm'

enum ResultNotificationOptions {
  NONE = 'NONE',
  ONLY_RATED = 'ONLY_RATED',
  ALL = 'ALL',
}

enum EventImportedNotificationOptions {
  NONE = 'NONE',
  ONLY_NATIONAL = 'ONLY_NATIONAL',
  ALL = 'ALL',
}

@Entity()
export class EmailRecipient implements IEmailRecipient {
  @PrimaryColumn()
  userId: number

  @Column({ nullable: true })
  email?: string

  @Column({ default: EventImportedNotificationOptions.ONLY_NATIONAL })
  @Check("eventImportedNotifications in('NONE', 'ONLY_NATIONAL', 'ALL')")
  eventImportedNotifications: EventImportedNotificationOptions

  @Column({ default: ResultNotificationOptions.ONLY_RATED })
  @Check("resultNotifications in('NONE', 'ONLY_RATED', 'ALL')")
  resultNotifications: ResultNotificationOptions

  @Column({ default: false })
  restricted: boolean
}
