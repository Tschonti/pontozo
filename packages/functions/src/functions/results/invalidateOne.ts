import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { EventState } from '../../../../common/src'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Event from '../../typeorm/entities/Event'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'

export const invalidateOneResult = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)
    const eventId = parseInt(req.params.eventId)

    const eventRepo = (await getAppDataSource(context)).getRepository(Event)
    const event = await eventRepo.findOne({ where: { id: eventId } })
    event.state = EventState.INVALIDATED
    await eventRepo.save(event)
    context.log(`User:${user.szemely_id} invalidated the rating results of event:${eventId}`)
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('results-invalidate', {
  methods: ['PATCH'],
  route: 'results/{eventId}',
  handler: invalidateOneResult,
})
