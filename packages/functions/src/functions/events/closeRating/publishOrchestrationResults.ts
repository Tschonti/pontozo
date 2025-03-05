import { InvocationContext } from '@azure/functions'
import * as df from 'durable-functions'
import { ActivityHandler } from 'durable-functions'
import { newAlertItem } from '../../../service/alert.service'

export const publishOrchestrationResultsActivityName = 'publishOrchestrationResults'

/**
 * Durable Functions activity that saves the result of the orchestration to the DB.
 * @param eventCount number of events with new results
 */
const publishOrchestrationResults: ActivityHandler = async (eventCount: number, context: InvocationContext): Promise<void> => {
  await newAlertItem({
    context,
    desc: `Accumulation of rating results finished for ${eventCount} event(s)!`,
  })
}
df.app.activity(publishOrchestrationResultsActivityName, { handler: publishOrchestrationResults })
