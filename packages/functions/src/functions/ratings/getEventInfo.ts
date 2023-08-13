import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { CategoryWithCriteria, EventRatingInfo, isHigherRank, PontozoException } from '@pontozo/common'
import { getUserFromHeader } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'

/**
 * Called after the users starts the rating of an event to get all the rating categories and criteria.
 */
export const getEventInfo = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const ratingId = parseInt(req.params.id)

    if (isNaN(ratingId)) {
      throw new PontozoException('Érvénytelen azonosító!', 400)
    }
    const user = getUserFromHeader(req)
    const ratingRepo = (await getAppDataSource()).getRepository(EventRating)
    const eventRatingAndEvent = await ratingRepo.findOne({
      where: { id: ratingId },
      relations: { event: { stages: true, season: { categories: { category: { criteria: { criterion: true } } } } } },
    })
    const { event, ...eventRating } = eventRatingAndEvent
    const { season } = event

    if (eventRating === null) {
      throw new PontozoException('Az értékelés nem található!', 404)
    }
    if (eventRating.userId !== user.szemely_id) {
      throw new PontozoException('Nincs jogosultságod a szempontok lekéréshez', 403)
    }

    const eventCategories: CategoryWithCriteria[] = []
    const stageCategories: CategoryWithCriteria[] = []

    season.categories
      .sort((stc1, stc2) => stc1.order - stc2.order)
      .forEach((stc) => {
        const filteredCriteria = stc.category.criteria
          .sort((ctc1, ctc2) => ctc1.order - ctc2.order)
          .map(({ criterion }) => {
            return {
              ...criterion,
              roles: JSON.parse(criterion.roles),
            } as Criterion
          })
          .filter((c) => c.roles.includes(eventRating.role) && (isHigherRank(event) || !c.nationalOnly))
        const eventCriteria = []
        const stageCriteria = []
        filteredCriteria.forEach((c) => {
          if (c.stageSpecific) {
            stageCriteria.push(c)
          } else {
            eventCriteria.push(c)
          }
        })
        if (stageCriteria.length > 0) {
          stageCategories.push({
            ...stc.category,
            criteria: stageCriteria,
          })
        }
        if (eventCriteria.length > 0) {
          eventCategories.push({
            ...stc.category,
            criteria: eventCriteria,
          })
        }
      })

    return {
      jsonBody: {
        ...eventRating,
        eventName: event.name,
        startDate: event.startDate,
        endDate: event.endDate,
        stages: event.stages,
        eventCategories,
        stageCategories,
      } as EventRatingInfo,
    }
  } catch (error) {
    return handleException(context, error)
  }
}

app.http('ratings-getEventInfo', {
  methods: ['GET'],
  route: 'ratings/{id}/info',
  handler: getEventInfo,
})
