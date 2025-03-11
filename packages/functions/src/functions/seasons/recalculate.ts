import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { AlertLevel, EventState, PontozoException } from '@pontozo/common'
import * as df from 'durable-functions'
import { newAlertItem } from '../../service/alert.service'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Event from '../../typeorm/entities/Event'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'
import { orchestratorName } from '../events/closeRating/closeRatingOrchestrator'

/**
 * Function to initiate the recalculation of rating scores for every event in a season.
 * It is called when an admin clicks on the 'Recalculate scores' button on the season's weight adjustment page.
 * The state of all the events of the season that are no longer rateable will be set to 'INVALITED', then
 * the closeRating orchestration function is called, which will redo the validation and accumulation stages for these events.
 */
const recalculateRatingsInSeason = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)
    const seasonId = validateId(req)
    const ads = await getAppDataSource(context)

    const season = await ads.getRepository(Season).findOne({ where: { id: seasonId }, relations: { events: true } })
    if (!season) {
      throw new PontozoException('A szezon nem talalhato!', 404)
    }

    await newAlertItem({
      context,
      desc: `User #${user.szemely_id} initiated result recalculation for Season #${seasonId}`,
      level: AlertLevel.INFO,
      ads,
    })

    const invalidatedEvents = season.events
      .filter((e) => e.state !== EventState.RATEABLE)
      .map((e) => ({ ...e, state: EventState.INVALIDATED }))

    if (invalidatedEvents.length > 0) {
      await ads.getRepository(Event).save(invalidatedEvents)
      const client = df.getClient(context)
      const instanceId = await client.startNew(orchestratorName, {
        input: { sendNotification: false, events: invalidatedEvents.map((e) => ({ eventId: e.id, state: e.state })) },
      })
      context.log(`Started orchestration with ID = '${instanceId}'.`)
    } else {
      context.log(`No events to recalculate`)
    }
    return {
      status: 204,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('season-recalculate', {
  route: 'seasons/{id}/recalculate',
  methods: ['POST'],
  handler: recalculateRatingsInSeason,
  extraInputs: [df.input.durableClient()],
})
