import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeader } from '../../service/auth.service'
import EventRating, { RatingStatus } from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'

export const submitOne = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid eventRating id!'
    }
  }
  const userServiceRes = getUserFromHeader(req)
  if (userServiceRes.isError) {
    return httpResFromServiceRes(userServiceRes)
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
    if (rating.userId !== userServiceRes.data.szemely_id) {
      return {
        status: 403,
        body: "You're not allowed to submit this rating!"
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
