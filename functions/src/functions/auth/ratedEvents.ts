import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeader } from '../../service/auth.service'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'

export const ratedEvents = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const userServiceRes = getUserFromHeader(req)
  if (userServiceRes.isError) {
    return httpResFromServiceRes(userServiceRes)
  }
  try {
    const eventRatings = await (await getAppDataSource())
      .getRepository(EventRating)
      .find({ where: { userId: userServiceRes.data.szemely_id }, relations: { event: true } })

    return {
      jsonBody: eventRatings
    }
  } catch (e) {
    context.log(e)
    return {
      status: 500,
      jsonBody: e
    }
  }
}

app.http('auth-ratedEvents', {
  methods: ['GET'],
  route: 'auth/rated',
  handler: ratedEvents
})
