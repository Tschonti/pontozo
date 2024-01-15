import * as df from 'durable-functions'
import { OrchestrationContext, OrchestrationHandler } from 'durable-functions'
import { calculateAvgRatingActivityName } from './calculateRatingsActivity'

export const orchestratorName = 'closeRatingOrchestrator'

const orchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
  const eventIds: number[] = context.df.getInput()
  context.log(`Orchestrator function started, starting the average rating calculation for ${eventIds.length} event(s).`)
  const parallelTasks: df.Task[] = eventIds.map((eId) => context.df.callActivity(calculateAvgRatingActivityName, eId))
  yield context.df.Task.all(parallelTasks)
  context.log(`Orchestrator function finished`)
}
df.app.orchestration(orchestratorName, orchestrator)
