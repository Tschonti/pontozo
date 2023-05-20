import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeader } from '../../service/auth.service'
import { getOneEvent } from '../../service/mtfsz.service'
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
      .find({ where: { userId: userServiceRes.data.szemely_id } })

    const events = []
    for (const er of eventRatings) {
      const eventRes = await getOneEvent(er.eventId)
      if (!eventRes.isError) {
        events.push({ ...eventRes.data, status: er.status })
      }
    }

    return {
      jsonBody: events
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
