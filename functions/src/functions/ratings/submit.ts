import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import EventRating, { RatingStatus } from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'

export const submitOne = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid eventRating id!'
    }
  }
  try {
    const eventRatingRepo = (await getAppDataSource()).getRepository(EventRating)
    const rating = await eventRatingRepo.findOneBy({ id })

    if (rating.status === RatingStatus.SUBMITTED) {
      return {
        status: 400,
        body: 'Rating already submitted'
      }
    }

    // todo maybe check if every criteria is rated?
    rating.status = RatingStatus.SUBMITTED
    rating.submittedAt = new Date()
    await eventRatingRepo.save(rating)

    return {
      status: 204
    }
  } catch (e) {
    context.log(e)
    return {
      status: 500,
      body: e
    }
  }
}

app.http('ratings-submit', {
  methods: ['POST'],
  route: 'ratings/{id}/submit',
  handler: submitOne
})
