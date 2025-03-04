import { IsEmail, IsEnum, IsOptional } from 'class-validator'

export interface EmailRecipient {
  userId: number
  email?: string
  resultNotifications: ResultNotificationOptions
  eventImportedNotifications: EventImportedNotificationOptions
  restricted: boolean
}

export enum ResultNotificationOptions {
  NONE = 'NONE',
  ONLY_RATED = 'ONLY_RATED',
  ALL = 'ALL',
}

export enum EventImportedNotificationOptions {
  NONE = 'NONE',
  ONLY_NATIONAL = 'ONLY_NATIONAL',
  ALL = 'ALL',
}

export class UpdateEmailRecipient {
  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsEnum(ResultNotificationOptions)
  resultNotifications?: ResultNotificationOptions

  @IsOptional()
  @IsEnum(ResultNotificationOptions)
  eventImportedNotifications?: EventImportedNotificationOptions
}
