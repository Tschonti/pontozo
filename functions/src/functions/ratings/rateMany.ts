import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { getOneEvent, stageFilter } from '../../service/mtfsz.service'
import { EventSection } from '../../service/types'
import Criterion from '../../typeorm/entities/Criterion'
import CriterionRating from '../../typeorm/entities/CriterionRating'
import EventRating, { RatingStatus } from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { myvalidate } from '../../util/validation'
import { CreateManyRatingsDto } from './types/createManyRatings.dto'

//todo this is unused right now
export const rateMany = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid eventRating id!'
    }
  }
  if (!req.body) {
    return {
      status: 400,
      body: `No body attached to POST query.`
    }
  }
  const dto = plainToClass(CreateManyRatingsDto, await req.json())
  const errors = await myvalidate(dto)
  if (errors.length > 0) {
    return {
      status: 400,
      jsonBody: errors
    }
  }
  try {
    const ads = await getAppDataSource()
    const eventRatingRepo = ads.getRepository(EventRating)
    const criterionRepo = ads.getRepository(Criterion)
    const eventRating = await eventRatingRepo.findOneBy({ id })
    if (eventRating === null) {
      return {
        status: 404,
        body: 'Rating not found'
      }
    }
    if (eventRating.status === RatingStatus.SUBMITTED) {
      return {
        status: 400,
        body: 'Rating already submitted!'
      }
    }

    const { data: event, isError, message, status } = await getOneEvent(eventRating.eventId)
    if (isError) {
      return {
        status,
        body: message
      }
    }
    const criteriaFilter = event.pontozoOrszagos ? undefined : { nationalOnly: false }
    let stage: EventSection | undefined = undefined
    if (dto.stageId) {
      stage = event.programok.find((p) => p.program_id === dto.stageId)
      if (!stage || !stageFilter(stage)) {
        return {
          status: 404,
          body: 'Stage not found or not rateable!'
        }
      }
    }

    const criteria: Criterion[] = (await criterionRepo.find({ where: { ...criteriaFilter, stageSpecific: !!stage } })).map((c) => ({
      ...c,
      roles: JSON.parse(c.roles)
    }))
    let error: HttpResponseInit = null
    dto.ratings.forEach((r) => {
      if (error === null) {
        const criterion = criteria.find((c) => c.id === r.criterionId)
        if (!criterion || !criterion.roles.includes(eventRating.role)) {
          error = {
            status: 400,
            body: 'Invalid criterion'
          }
        }
      }
    })
    if (error !== null) {
      return error
    }

    // todo nem lehetne valahogy more efficiently menteni?
    const criterionRatingRepo = ads.getRepository(CriterionRating)
    dto.ratings.forEach(async (r) => {
      const rating = await criterionRatingRepo.findOneBy({ criterion: { id: r.criterionId }, eventRating: { id } })
      if (rating === null) {
        await criterionRatingRepo.insert({
          criterion: { id: r.criterionId },
          value: r.value,
          eventRating: { id },
          stageId: stage?.program_id
        })
      } else {
        rating.value = r.value
        await criterionRatingRepo.save(rating)
      }
    })

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

app.http('ratings-rateMany', {
  methods: ['POST'],
  route: 'ratings/{id}/many',
  handler: rateMany
})
