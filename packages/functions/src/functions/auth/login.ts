import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { EventImportedNotificationOptions, PontozoException, ResultNotificationOptions } from '@pontozo/common'
import * as jwt from 'jsonwebtoken'
import { getToken, getUser } from '../../service/mtfsz.service'
import { EmailRecipient } from '../../typeorm/entities/EmailRecipient'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { FRONTEND_URL, JWT_SECRET } from '../../util/env'
import { handleException } from '../../util/handleException'

export const login = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const authorizationCode = req.query.get('code')
    if (!authorizationCode) {
      throw new PontozoException('Nem sikerült az autentikáció!', 401)
    }

    const oauthToken = await getToken(authorizationCode)
    const user = await getUser(oauthToken.access_token)
    const dataSource = await getAppDataSource(context)
    const roles = (await dataSource.getRepository(UserRoleAssignment).find({ where: { userId: user.szemely_id } })).map((r) => r.role)
    const emailRepo = dataSource.getRepository(EmailRecipient)
    const userEmail = await emailRepo.findOne({ where: { userId: user.szemely_id } })
    if (!userEmail) {
      const emailRecord = new EmailRecipient()
      emailRecord.userId = user.szemely_id
      emailRecord.email = user.email
      emailRecord.eventImportedNotifications = EventImportedNotificationOptions.ONLY_NATIONAL
      emailRecord.resultNotifications = ResultNotificationOptions.ONLY_RATED
      await emailRepo.save(emailRecord)
    }

    const jwtToken = jwt.sign({ ...user, roles }, JWT_SECRET, { expiresIn: '7 days' })
    context.log(`User #${user.szemely_id} signed in`)
    return {
      status: 302,
      headers: {
        location: `${FRONTEND_URL}/authorized?token=${jwtToken}`,
      },
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('auth-login', {
  methods: ['GET'],
  route: 'auth/callback',
  handler: login,
})
