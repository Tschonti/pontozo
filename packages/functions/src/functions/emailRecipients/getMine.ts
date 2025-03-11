import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { PontozoException } from '@pontozo/common'
import { getUserFromHeader } from '../../service/auth.service'
import { EmailRecipient } from '../../typeorm/entities/EmailRecipient'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { PontozoResponse } from '../../util/pontozoResponse'

/**
 * Called when the user opens the notification settings modal to query the user's notification preferences
 */
export const getMyEmailInfo = async (req: HttpRequest, context: InvocationContext): Promise<PontozoResponse<EmailRecipient>> => {
  try {
    const user = getUserFromHeader(req)
    const recipient = await (await getAppDataSource(context)).getRepository(EmailRecipient).findOne({ where: { userId: user.szemely_id } })
    if (!recipient) {
      throw new PontozoException('E-mail cím rekord nem található!', 404)
    }

    return {
      jsonBody: recipient,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('emailRecipients-getMine', {
  methods: ['GET'],
  route: 'emails/mine',
  handler: getMyEmailInfo,
})
