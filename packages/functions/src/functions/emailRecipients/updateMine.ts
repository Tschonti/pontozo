import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { UpdateEmailRecipient } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { getUserFromHeader } from '../../service/auth.service'
import { EmailRecipient } from '../../typeorm/entities/EmailRecipient'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateBody, validateWithWhitelist } from '../../util/validation'

/**
 * Called when the user saves their new notification preferences
 */
export const setMyEmailInfo = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = getUserFromHeader(req)

    validateBody(req)
    const dto = plainToClass(UpdateEmailRecipient, await req.json())
    await validateWithWhitelist(dto)

    await (await getAppDataSource(context)).getRepository(EmailRecipient).update(user.szemely_id, { ...dto, restricted: false })

    return {
      status: 204,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('emailRecipients-updateMine', {
  methods: ['PATCH'],
  route: 'emails/mine',
  handler: setMyEmailInfo,
})
