import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { AlertLevel, EventState } from '@pontozo/common'
import { getRedisClient } from '../../redis/redisClient'
import { newAlertItem } from '../../service/alert.service'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Event from '../../typeorm/entities/Event'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'

export const invalidateOneResult = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)
    const eventId = parseInt(req.params.eventId)
    const ads = await getAppDataSource(context)
    const eventRepo = ads.getRepository(Event)
    const redisClient = await getRedisClient(context)

    const event = await eventRepo.findOne({ where: { id: eventId } })
    event.state = EventState.INVALIDATED
    await eventRepo.save(event)
    await redisClient.del(`ratingResult:${eventId}`)
    newAlertItem({
      ads,
      context,
      desc: `User:${user.szemely_id} invalidated the rating results of event:${eventId}`,
      level: AlertLevel.WARN,
    })
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('results-invalidate', {
  methods: ['PATCH'],
  route: 'results/{eventId}',
  handler: invalidateOneResult,
})
