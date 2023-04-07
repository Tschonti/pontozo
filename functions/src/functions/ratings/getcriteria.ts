import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import Criterion from '../../lib/typeorm/entities/Criterion'
import EventRating from '../../lib/typeorm/entities/EventRating'
import { getAppDataSource } from '../../lib/typeorm/getConfig'

export const getCriteria = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const ratingId = parseInt(req.params.id)
  const ads = await getAppDataSource()
  const ratingRepo = ads.getRepository(EventRating)
  const criterionRepo = ads.getRepository(Criterion)
  const rating = await ratingRepo.findOneBy({ id: ratingId })
  if (rating === null) {
    return {
      status: 404,
      body: 'Rating not found!'
    }
  }
  const criteria = await criterionRepo.find()
  const rateable = criteria
    .map((c) => ({ ...c, roles: JSON.parse(c.roles as unknown as string) } as Criterion))
    .filter((c) => c.roles.includes(rating.role))
  return {
    body: JSON.stringify({ ...rating, criteria: rateable })
  }
}

app.http('ratings-getcriteria', {
  methods: ['GET'],
  route: 'ratings/{id}',
  handler: getCriteria
})
