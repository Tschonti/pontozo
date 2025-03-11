import { EventState } from '@pontozo/common'
import * as df from 'durable-functions'
import { OrchestrationContext, OrchestrationHandler } from 'durable-functions'
import { ENV } from '../../../util/env'
import { calculateAvgRatingActivityName } from './calculateRatingsActivity'
import { deletePreviousResultsActivityName } from './deletePreviousResultsActivity'
import { publishOrchestrationResultsActivityName } from './publishOrchestrationResults'
import { sendNotificationsActivityName } from './sendNotificationsActivity'
import { validateRatingsActivityName } from './validateRatingsActivity'

export const orchestratorName = 'closeRatingOrchestrator'
export type ActivityOutput = { eventId: number; success: boolean }
export type CalculateRatingsActivityOutput = ActivityOutput & { actualResults: boolean }
export type OrchestratorParams = {
  sendNotification: boolean
  events: { eventId: number; state: EventState }[]
}

/**
 * Durable Functions orchestrator function that executes the activies that validate and accumulate the ratings of finished events.
 *
 * Inputs: List of events to close. For each event, the eventId and the EventState
 *
 * Steps:
 * 1. DeletePreviousResults
 *    If some events have already started the proccess of closing before, the previous results have to be cleaned up.
 *    This activity is only called if there are events not in the VALIDATING state and only once. All the eventIds that are not in the validating state are passed as inputs.
 * 2. ValidateRatings
 *    Activity to validate the ratings of an event. Currently just a placeholder, does nothing.
 *    The activity is called in parallel for all the events in VALIDATING or INVALIDATED states.
 * 3. CalculateAvgRating
 *    Activity to calculate the rating scores for an event.
 *    Called in parallel for all events whose ratings were successfully validated and events that are in the ACCUMULATING phase (because previous accumulation failed)
 * 4. SendNotifications
 *    Activity to send notifications to subscribed users about the newly published rating results.
 *    Only called if at least event has been closed with meaningful results (more than one rating),
 *    the app is running in production mode and the orchestration was initiated by the close rating starter (called automatically at night), not the manual recalculate function.
 *    Called just once with the events that have meaningful results.
 * 5. PublishOrchestrationResults
 *    If the accumulation succeeded for at least one event, this activity is called once to save the Alert to the DB to notify the admins that the accumulation has finished.
 */
const orchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
  const { events, sendNotification }: OrchestratorParams = context.df.getInput()
  context.log(`Orchestrator function started, starting the validation of ratings for ${events.length} event(s).`)

  const eventsToRedo = events.filter((e) => e.state !== EventState.VALIDATING)
  if (eventsToRedo.length > 0) {
    context.log(`Some event results have to be revalidated, deleting the previous results of ${eventsToRedo.length} event(s).`)
    const success = yield context.df.callActivity(
      deletePreviousResultsActivityName,
      eventsToRedo.map((e) => e.eventId)
    )
    if (!success) {
      return
    }
  }

  const parallelValidationTasks: df.Task[] = events
    .filter((e) => e.state === EventState.VALIDATING || e.state === EventState.INVALIDATED)
    .map((e) => context.df.callActivity(validateRatingsActivityName, e.eventId))
  const validationResults: ActivityOutput[] = parallelValidationTasks.length > 0 ? yield context.df.Task.all(parallelValidationTasks) : []

  const validationSuccess = validationResults.filter((o) => o.success)
  const accumulationInput = [
    ...validationSuccess.map((o) => o.eventId),
    ...events.filter((e) => e.state === EventState.ACCUMULATING).map((e) => e.eventId),
  ]

  context.log(`Validation finished, starting the average rating calculation for ${accumulationInput.length} event(s).`)
  const parallelAccumulationTasks: df.Task[] = accumulationInput.map((eId) => context.df.callActivity(calculateAvgRatingActivityName, eId))
  const accumulationResults: CalculateRatingsActivityOutput[] = yield context.df.Task.all(parallelAccumulationTasks)

  const accumulationSuccess = accumulationResults.filter((r) => r.success)
  if (accumulationSuccess.length > 0) {
    const eventsWithMeaningfulResults = accumulationSuccess.filter((r) => r.actualResults).map((r) => r.eventId)
    if (eventsWithMeaningfulResults.length > 0 && ENV === 'production' && sendNotification) {
      yield context.df.callActivity(sendNotificationsActivityName, eventsWithMeaningfulResults)
    }
    yield context.df.callActivity(publishOrchestrationResultsActivityName, accumulationSuccess.length)
  }

  context.log(`Orchestrator function finished`)
}
df.app.orchestration(orchestratorName, orchestrator)
