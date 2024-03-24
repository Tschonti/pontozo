import { InvocationContext } from '@azure/functions'
import * as df from 'durable-functions'
import { ActivityHandler } from 'durable-functions'
import { DataSource, In } from 'typeorm'
import { DBConfig } from '../../../typeorm/configOptions'
import { RatingResult } from '../../../typeorm/entities/RatingResult'

export const deletePreviousResultsActivityName = 'deletePreviousResultsActivity'

const deletePreviousResults: ActivityHandler = async (eventIds: number[], context: InvocationContext): Promise<boolean> => {
  try {
    const ads = await new DataSource(DBConfig).initialize()

    const ratingResultRepo = ads.getRepository(RatingResult)
    const ratingResults = await ratingResultRepo.find({ where: { eventId: In(eventIds) } })
    if (ratingResults.length > 0) {
      await ratingResultRepo.delete(ratingResults.map((rr) => rr.id))
    }
    return true
  } catch (e) {
    context.error(`Error in deleting previous results: ${e}`)
    return false
  }
}
df.app.activity(deletePreviousResultsActivityName, { handler: deletePreviousResults })
