import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { CategoryWithCriteria, Criterion, EventRatingInfo, isHigherRank, PontozoException } from '@pontozo/common'
import { getUserFromHeader } from '../../service/auth.service'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { PontozoResponse } from '../../util/pontozoResponse'
import { validateId } from '../../util/validation'

/**
 * Called after the users starts the rating of an event to get all the rating categories and criteria.
 */
export const getEventInfo = async (req: HttpRequest, context: InvocationContext): Promise<PontozoResponse<EventRatingInfo>> => {
  try {
    const ratingId = validateId(req)
    const user = getUserFromHeader(req)
    const ratingRepo = (await getAppDataSource(context)).getRepository(EventRating)
    const eventRatingAndEvent = await ratingRepo.findOne({
      where: { id: ratingId },
      relations: { event: { season: { categories: { category: { criteria: { criterion: true } } } } }, stages: true },
    })
    if (eventRatingAndEvent === null) {
      throw new PontozoException('A verseny nem található vagy nem értékelhető!', 404)
    }
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
        const eventCriteria: Criterion[] = []
        const stageCriteria: Criterion[] = []
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
        eventCategories,
        stageCategories,
      },
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('ratings-getEventInfo', {
  methods: ['GET'],
  route: 'ratings/{id}/info',
  handler: getEventInfo,
})
