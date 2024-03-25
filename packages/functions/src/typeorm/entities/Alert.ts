import { Alert as IAlert } from '@pontozo/common'
import { Check, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

enum AlertLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

@Entity()
class Alert implements Omit<IAlert, 'level'> {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  description: string

  @Column({ enum: AlertLevel })
  @Check("level in('INFO', 'WARN', 'ERROR')")
  level: string

  @CreateDateColumn()
  timestamp: Date
}

export default Alert
