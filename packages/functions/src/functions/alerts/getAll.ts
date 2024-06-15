import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { Between } from 'typeorm'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Alert from '../../typeorm/entities/Alert'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { PontozoResponse } from '../../util/pontozoResponse'

/**
 * Called when the user visits the admin frontpage. Returns all the alerts from the past 14 days.
 */
export const getAlerts = async (req: HttpRequest, context: InvocationContext): Promise<PontozoResponse<Alert[]>> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req, context)
    const currentDate = new Date()
    const pastDate = new Date()
    pastDate.setDate(currentDate.getDate() - 14)
    const alerts = await (await getAppDataSource(context)).getRepository(Alert).find({
      where: {
        timestamp: Between(pastDate, currentDate),
      },
    })
    return {
      jsonBody: alerts,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('alerts-getAll', {
  methods: ['GET'],
  route: 'alerts',
  handler: getAlerts,
})
