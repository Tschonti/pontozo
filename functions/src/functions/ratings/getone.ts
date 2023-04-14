import { app, HttpRequest, InvocationContext } from '@azure/functions'
import Criterion from '../../lib/typeorm/entities/Criterion'
import EventRating from '../../lib/typeorm/entities/EventRating'
import { getAppDataSource } from '../../lib/typeorm/getConfig'
import { JsonResWrapper, ResponseParams } from '../../lib/util'
import { CriterionToRate } from './types/criterionToRate.dto'

export const getRating = async (req: HttpRequest, context: InvocationContext): Promise<ResponseParams> => {
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
    body: { ...rating, criteria: rateable }
  }
}

app.http('ratings-getone', {
  methods: ['GET'],
  route: 'ratings/{id}',
  handler: (req, context) => JsonResWrapper(getRating(req, context))
})
