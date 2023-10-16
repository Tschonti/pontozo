import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { CreateEventRating, PontozoException, RatingRole, UserRole } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { QueryFailedError } from 'typeorm'
import { getUserFromHeader } from '../../service/auth.service'
import Event from '../../typeorm/entities/Event'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { validateBody, validateWithWhitelist } from '../../util/validation'

/**
 * Called when a user starts rating an event to initialize the EventRating entity.
 * HTTP body should be CreateEventRatingDto
 */
export const createRating = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    validateBody(req)
    const user = getUserFromHeader(req)
    const dto = plainToClass(CreateEventRating, await req.json())
    await validateWithWhitelist(dto)

    if (
      (dto.role === RatingRole.COACH && !user.roles.includes(UserRole.COACH)) ||
      (dto.role === RatingRole.JURY && !user.roles.includes(UserRole.JURY))
    ) {
      throw new PontozoException('Ebben a szerepkörben te nem értékelhetsz!', 403)
    }
    const ads = await getAppDataSource(context)
    const eventRepo = ads.getRepository(Event)
    const ratingRepo = ads.getRepository(EventRating)

    const event = await eventRepo.findOne({ where: { id: dto.eventId, rateable: true }, relations: { stages: true } })
    if (event === null) {
      throw new PontozoException('A verseny nem található vagy nem értékelhető!', 404)
    }
    const validStages = event.stages.filter((s) => dto.stageIdsToRate.includes(s.id))
    if (validStages.length === 0) {
      throw new PontozoException('Érvénytelen futamok!', 400)
    }
    const currentYear = new Date().getFullYear()
    const raterYOB = parseInt(user.szul_dat.split('-')[0])

    const eventRating = new EventRating()
    eventRating.eventId = dto.eventId
    eventRating.userId = user.szemely_id
    eventRating.role = dto.role
    eventRating.createdAt = new Date()
    eventRating.stages = validStages
    eventRating.raterAge = isNaN(raterYOB) ? 0 : currentYear - raterYOB

    const res = await ratingRepo.save(eventRating)

    context.log(`User #${user.szemely_id} started rating Event #${dto.eventId}, new eventRatingId: ${res.id}`)
    return {
      status: 201,
      jsonBody: res,
    }
  } catch (e) {
    switch (e.constructor) {
      case QueryFailedError:
        if ((e as QueryFailedError).message.startsWith('Error: Violation of UNIQUE KEY constraint')) {
          return {
            status: 400,
            jsonBody: {
              statusCode: 400,
              message: 'Már megkezdted ennek a versenynek az értékelését!',
            },
          }
        }
        break
      case PontozoException: {
        const error = e as PontozoException
        return {
          status: error.status,
          jsonBody: error.getError(),
        }
      }
    }
    context.log(e)
    return {
      status: 500,
      jsonBody: {
        statusCode: 500,
        message: 'Ismeretlen hiba!',
      },
    }
  }
}

app.http('ratings-create', {
  methods: ['POST'],
  route: 'ratings',
  handler: createRating,
})
