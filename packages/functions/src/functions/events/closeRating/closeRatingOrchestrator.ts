import { AlertLevel, EventState } from '@pontozo/common'
import * as df from 'durable-functions'
import { OrchestrationContext, OrchestrationHandler } from 'durable-functions'
import { newAlertItem } from '../../../service/alert.service'
import { calculateAvgRatingActivityName } from './calculateRatingsActivity'
import { deletePreviousResultsActivityName } from './deletePreviousResultsActivity'
import { validateRatingsActivityName } from './validateRatingsActivity'

export const orchestratorName = 'closeRatingOrchestrator'
export type ActivityOutput = { eventId: number; success: boolean }

const orchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
  const events: { eventId: number; state: EventState }[] = context.df.getInput()
  context.log(`Orchestrator function started, starting the validation of ratings for ${events.length} event(s).`)

  const eventsToRedo = events.filter((e) => e.state !== EventState.VALIDATING)
  if (eventsToRedo.length > 0) {
    context.log(`Some event results have to be revalidated, deleting the previous results of ${eventsToRedo.length} event(s).`)
    const success = yield context.df.callActivity(
      deletePreviousResultsActivityName,
      eventsToRedo.map((e) => e.eventId)
    )
    if (!success) {
      newAlertItem({ context, desc: 'Deletion of previous rating results failed!', level: AlertLevel.ERROR })
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

  if (validationSuccess.length < parallelValidationTasks.length) {
    newAlertItem({
      context,
      desc: `Validation of ${parallelValidationTasks.length - validationSuccess.length} event(s) failed!`,
      level: AlertLevel.WARN,
    })
  }

  context.log(`Validation finished, starting the average rating calculation for ${accumulationInput.length} event(s).`)
  const parallelAccumulationTasks: df.Task[] = accumulationInput.map((eId) => context.df.callActivity(calculateAvgRatingActivityName, eId))
  const accumulationResults: ActivityOutput[] = yield context.df.Task.all(parallelAccumulationTasks)

  const accumulationSuccess = accumulationResults.filter((r) => r.success)
  if (accumulationSuccess.length < accumulationInput.length) {
    newAlertItem({
      context,
      desc: `Accumulation of rating results failed for ${accumulationInput.length - accumulationSuccess.length} event(s)!`,
      level: AlertLevel.WARN,
    })
  }
  if (accumulationSuccess.length > 0) {
    newAlertItem({
      context,
      desc: `Accumulation of rating results finished for ${accumulationSuccess.length} event(s)!`,
    })
  }

  context.log(`Orchestrator function finished`)
}
df.app.orchestration(orchestratorName, orchestrator)
