import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { isHigherRank, PontozoException, RatingStatus } from '@pontozo/common'
import { getUserFromHeader } from '../../service/auth.service'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

/**
 * Called when the users submits their rating of an event.
 * Checks that all criteria has been rated.
 */
export const submitOne = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const id = validateId(req)
    const user = getUserFromHeader(req)
    const ads = await getAppDataSource()
    const eventRatingRepo = ads.getRepository(EventRating)
    const rating = await eventRatingRepo.findOne({
      where: { id },
      relations: { ratings: true, event: { stages: true, season: { categories: { category: { criteria: { criterion: true } } } } } },
    })

    if (rating.status === RatingStatus.SUBMITTED) {
      throw new PontozoException('Az értékelés már véglegesítve lett!', 400)
    }
    if (rating.userId !== user.szemely_id) {
      throw new PontozoException('Te nem véglegesítheted ezt az értékelést!', 403)
    }
    if (!rating.event.rateable) {
      throw new PontozoException('Ezt a versenyt már nem lehet értékelni!', 400)
    }
    const { season, stages } = rating.event
    let criterionCount = 0
    season.categories.forEach((stc) => {
      stc.category.criteria.forEach(({ criterion: c }) => {
        if (c.roles.includes(rating.role) && (isHigherRank(rating.event) || !c.nationalOnly)) {
          if (c.stageSpecific) {
            criterionCount = criterionCount + stages.length
          } else {
            criterionCount++
          }
        }
      })
    })

    if (criterionCount !== rating.ratings.length) {
      throw new PontozoException('Nem értékelted le a versenyt az összes szempont szerint!', 400)
    }

    rating.status = RatingStatus.SUBMITTED
    rating.submittedAt = new Date()
    await eventRatingRepo.save(rating)

    return {
      status: 204,
    }
  } catch (error) {
    return handleException(context, error)
  }
}

app.http('ratings-submit', {
  methods: ['POST'],
  route: 'ratings/{id}/submit',
  handler: submitOne,
})
