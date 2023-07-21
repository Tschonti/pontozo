import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeader } from '../../service/auth.service'
import { isHigherRankDB } from '../../service/mtfsz.service'
import EventRating, { RatingStatus } from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'

/**
 * Called when the users submits their rating of an event.
 * Checks that all criteria has been rated.
 */
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
    const ads = await getAppDataSource()
    const eventRatingRepo = ads.getRepository(EventRating)
    const rating = await eventRatingRepo.findOne({
      where: { id },
      relations: { ratings: true, event: { stages: true, season: { categories: { category: { criteria: { criterion: true } } } } } }
    })

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
    if (!rating.event.rateable) {
      return {
        status: 400,
        body: 'This event can no longer be rated!'
      }
    }
    const { season, stages } = rating.event
    let criterionCount = 0
    season.categories.forEach((stc) => {
      stc.category.criteria.forEach(({ criterion: c }) => {
        if (c.roles.includes(rating.role) && (isHigherRankDB(rating.event) || !c.nationalOnly)) {
          if (c.stageSpecific) {
            criterionCount = criterionCount + stages.length
          } else {
            criterionCount++
          }
        }
      })
    })

    if (criterionCount !== rating.ratings.length) {
      return {
        status: 400,
        body: "You haven't rated all the criteria yet!"
      }
    }

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
