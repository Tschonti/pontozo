import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import Criterion from '../lib/typeorm/entities/Criterion'
import EventRating from '../lib/typeorm/entities/EventRating'
import { getAppDataSource } from '../lib/typeorm/getConfig'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const ratingId = context.bindingData.id as number
  const ads = await getAppDataSource()
  const ratingRepo = ads.getRepository(EventRating)
  const criterionRepo = ads.getRepository(Criterion)
  const rating = await ratingRepo.findOneBy({ id: ratingId })
  if (rating === null) {
    context.res = {
      status: 404,
      body: 'Rating not found!'
    }
    return
  }
  const criteria = await criterionRepo.find()
  const rateable = criteria
    .map((c) => ({ ...c, roles: JSON.parse(c.roles as unknown as string) } as Criterion))
    .filter((c) => c.roles.includes(rating.role))
  context.res = {
    body: { ...rating, criteria: rateable }
  }
}

export default httpTrigger
