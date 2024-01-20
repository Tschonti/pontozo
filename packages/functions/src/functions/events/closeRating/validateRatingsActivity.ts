import { EventState } from '@pontozo/common'
import * as df from 'durable-functions'
import { ActivityHandler, OrchestrationContext } from 'durable-functions'
import { DataSource } from 'typeorm'
import { DBConfig } from '../../../typeorm/configOptions'
import Event from '../../../typeorm/entities/Event'

export const validateRatingsActivityName = 'validateRatingsActivity'
type Props = { eventId: number; context: OrchestrationContext }

const validateRatings: ActivityHandler = async ({ context, eventId }: Props): Promise<boolean> => {
  try {
    const ads = new DataSource(DBConfig)
    await ads.initialize()

    const event = await ads.getRepository(Event).findOne({ where: { id: eventId, state: EventState.VALIDATING } })
    if (!event) {
      context.warn(`Event:${eventId} not found or is in invalid state, cancelling validation.`)
      return false
    }

    // TODO validation

    event.state = EventState.ACCUMULATING
    await ads.manager.save(event)
    return true
  } catch (e) {
    context.error(`Error in validate ratings activity for event:${eventId}: ${e}`)
    return false
  }
}
df.app.activity(validateRatingsActivityName, { handler: validateRatings })
