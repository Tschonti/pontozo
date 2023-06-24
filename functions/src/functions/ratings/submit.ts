import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeader } from '../../service/auth.service'
import { getOneEvent, stageFilter } from '../../service/mtfsz.service'
import EventRating, { RatingStatus } from '../../typeorm/entities/EventRating'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { currentSeasonFilter } from '../../util/currentSeasonFilter'
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
    const ads = await getAppDataSource()
    const seasonRepo = ads.getRepository(Season)
    const eventRatingRepo = ads.getRepository(EventRating)
    const rating = await eventRatingRepo.findOne({ where: { id }, relations: { ratings: true } })

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
    const seasonQuery = seasonRepo.findOne({
      where: currentSeasonFilter,
      relations: { categories: { category: { criteria: { criterion: true } } } }
    })
    const eventQuery = getOneEvent(rating.eventId)
    const [season, { data: event, isError, message, status }] = await Promise.all([seasonQuery, eventQuery])
    if (isError) {
      return {
        status,
        body: message
      }
    }
    if (season === null) {
      return {
        status: 400,
        body: 'Jelenleg nincs értékelési szezon!'
      }
    }

    const stageCount = event.programok.filter(stageFilter).length
    let criterionCount = 0
    season.categories.forEach((stc) => {
      stc.category.criteria.forEach(({ criterion: c }) => {
        if (c.roles.includes(rating.role) && (event.pontozoOrszagos || !c.nationalOnly)) {
          if (c.stageSpecific) {
            criterionCount = criterionCount + stageCount
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
