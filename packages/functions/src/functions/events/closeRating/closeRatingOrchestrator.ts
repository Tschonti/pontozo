import * as df from 'durable-functions'
import { OrchestrationContext, OrchestrationHandler } from 'durable-functions'
import { calculateAvgRatingActivityName } from './calculateRatingsActivity'
import { validateRatingsActivityName } from './validateRatingsActivity'

export const orchestratorName = 'closeRatingOrchestrator'

const orchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
  const eventIds: number[] = context.df.getInput()

  // context.log(`Orchestrator function started, starting the validation of ratings for ${eventIds.length} event(s).`)
  // const parallelValidationTasks: df.Task[] = eventIds.map((eId) => context.df.callActivity(validateRatingsActivityName, eId))
  // const validationResults: CalculateAvgRatingOutput[] = yield context.df.Task.all(parallelValidationTasks)
  // const accumulationInput = validationResults.filter((o) => o.success).map((o) => o.eventId)

  // context.log(`Validation finished, starting the average rating calculation for ${accumulationInput.length} event(s).`)
  // const parallelAccumulationTasks: df.Task[] = accumulationInput.map((eId) => context.df.callActivity(calculateAvgRatingActivityName, eId))
  // yield context.df.Task.all(parallelAccumulationTasks)

  yield context.df.callActivity(validateRatingsActivityName, { eventId: 1002, context })
  yield context.df.callActivity(calculateAvgRatingActivityName, { eventId: 1002, context })

  context.log(`Orchestrator function finished`)
}
df.app.orchestration(orchestratorName, orchestrator)
