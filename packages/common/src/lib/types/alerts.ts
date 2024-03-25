export enum AlertLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface Alert {
  id: number
  description: string
  level: AlertLevel
  timestamp: Date
}
