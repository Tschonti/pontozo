import { InvocationContext } from '@azure/functions'
import { AlertLevel } from '@pontozo/common'
import { DataSource } from 'typeorm'
import Alert from '../typeorm/entities/Alert'
import { getAppDataSource } from '../typeorm/getConfig'

type AlertCreateInput = {
  context: InvocationContext
  ads?: DataSource
  desc: string
  level?: AlertLevel
}

export const newAlertItem = async ({ context, desc, level = AlertLevel.INFO, ads }: AlertCreateInput) => {
  try {
    let dataSource = ads
    if (!dataSource) {
      dataSource = await getAppDataSource(context)
    }
    switch (level) {
      case AlertLevel.INFO:
        context.log(desc)
        break
      case AlertLevel.WARN:
        context.warn(desc)
        break
      case AlertLevel.ERROR:
        context.error(desc)
    }

    const alert = new Alert()
    alert.description = desc
    alert.level = level
    await dataSource.getRepository(Alert).save(alert)
  } catch (e) {
    context.error('Failed to create alert.', e)
  }
}
