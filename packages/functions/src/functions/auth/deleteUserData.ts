import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeader } from '../../service/auth.service'
import { EmailRecipient } from '../../typeorm/entities/EmailRecipient'
import EventRating from '../../typeorm/entities/EventRating'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'

/**
 * Called when the user decides to delete all data stored about them
 */
export const purgeUser = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = getUserFromHeader(req)
    const ads = await getAppDataSource(context)
    const emailRepo = ads.getRepository(EmailRecipient)
    const eventRatingRepo = ads.getRepository(EventRating)
    const uraRepo = ads.getRepository(UserRoleAssignment)

    await Promise.all([
      emailRepo.delete(user.szemely_id),
      eventRatingRepo.delete({ userId: user.szemely_id }),
      uraRepo.delete({ userId: user.szemely_id }),
    ])

    return {
      status: 204,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('user-purge', {
  methods: ['DELETE'],
  route: 'users',
  handler: purgeUser,
})
