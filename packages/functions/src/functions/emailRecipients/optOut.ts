import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { EventImportedNotificationOptions, ResultNotificationOptions } from '@pontozo/common'
import { getUserFromHeader } from '../../service/auth.service'
import { EmailRecipient } from '../../typeorm/entities/EmailRecipient'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'

/**
 * Called when the user opts out of email notifications
 */
export const optOut = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = getUserFromHeader(req)

    await (await getAppDataSource(context)).getRepository(EmailRecipient).update(user.szemely_id, {
      email: '',
      eventImportedNotifications: EventImportedNotificationOptions.NONE,
      resultNotifications: ResultNotificationOptions.NONE,
      restricted: false,
    })

    return {
      status: 204,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('emailRecipients-optOut', {
  methods: ['PATCH'],
  route: 'emails/optOut',
  handler: optOut,
})
