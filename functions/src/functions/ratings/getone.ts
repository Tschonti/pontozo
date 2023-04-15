import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import Criterion from '../../typeorm/entities/Criterion'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { CriterionToRate } from './types/criterionToRate.dto'

export const getRating = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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
  const criteria = await criterionRepo.find({ relations: { ratings: { eventRating: true } } })
  const rateable = criteria
    .map(({ ratings, ...c }) => {
      const rating = ratings.find((r) => r.eventRating.id === ratingId)
      return {
        ...c,
        roles: JSON.parse(c.roles as unknown as string),
        rating: rating
          ? {
              id: rating.id,
              value: rating.value
            }
          : undefined
      } as CriterionToRate
    })
    .filter((c) => c.roles.includes(rating.role))
  return {
    jsonBody: { ...rating, criteria: rateable }
  }
}

app.http('ratings-getone', {
  methods: ['GET'],
  route: 'ratings/{id}',
  handler: getRating
})
