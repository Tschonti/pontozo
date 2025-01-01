import { InvocationContext } from '@azure/functions'
import { EventState } from '@pontozo/common'
import * as df from 'durable-functions'
import { ActivityHandler } from 'durable-functions'
import { DataSource } from 'typeorm'
import { DBConfig } from '../../../typeorm/configOptions'
import Event from '../../../typeorm/entities/Event'
import { ActivityOutput } from './closeRatingOrchestrator'

export const validateRatingsActivityName = 'validateRatingsActivity'

/**
 * Durable Functions activity that validates all the ratings for a given event. For now it does nothing, just a placeholder TODO
 * @param eventId ID of the event whose ratings wil be validated
 * @returns whether the operation succeeded and the eventId
 */
const validateRatings: ActivityHandler = async (eventId: number, context: InvocationContext): Promise<ActivityOutput> => {
  try {
    const ads = await new DataSource(DBConfig).initialize()

    const event = await ads.getRepository(Event).findOne({
      where: [
        { id: eventId, state: EventState.VALIDATING },
        { id: eventId, state: EventState.INVALIDATED },
      ],
    })
    if (!event) {
      context.warn(`Event:${eventId} not found or is in invalid state, cancelling validation.`)
      return { success: false, eventId }
    }

    // TODO validation

    event.state = EventState.ACCUMULATING
    await ads.manager.save(event)
    return { success: true, eventId }
  } catch (e) {
    context.error(`Error in validate ratings activity for event:${eventId}: ${e}`)
    return { success: false, eventId }
  }
}
df.app.activity(validateRatingsActivityName, { handler: validateRatings })
