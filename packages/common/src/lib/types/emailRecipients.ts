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
