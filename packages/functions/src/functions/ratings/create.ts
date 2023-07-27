import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { getUserFromHeader } from '../../service/auth.service'
import Event from '../../typeorm/entities/Event'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { validateWithWhitelist } from '../../util/validation'
import { CreateEventRating, RatingRole, UserRole } from '@pontozo/common'

/**
 * Called when a user starts rating an event to initialize the EventRating entity.
 * HTTP body should be CreateEventRatingDto
 */
export const createRating = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  if (!req.body) {
    return {
      status: 400,
      body: `No body attached to POST query.`,
    }
  }

  const userServiceRes = getUserFromHeader(req)
  if (userServiceRes.isError) {
    return httpResFromServiceRes(userServiceRes)
  }

  try {
    const dto = plainToClass(CreateEventRating, await req.json())
    const errors = await validateWithWhitelist(dto)
    if (errors.length > 0) {
      return {
        status: 400,
        jsonBody: errors,
      }
    }

    if (
      (dto.role === RatingRole.COACH && !userServiceRes.data.roles.includes(UserRole.COACH)) ||
      (dto.role === RatingRole.JURY && !userServiceRes.data.roles.includes(UserRole.JURY))
    ) {
      return {
        status: 403,
        body: 'You are not allowed to rate an event with this role',
      }
    }
    const ads = await getAppDataSource()
    const eventRepo = ads.getRepository(Event)
    const ratingRepo = ads.getRepository(EventRating)

    const event = await eventRepo.findOne({ where: { id: dto.eventId, rateable: true } })
    if (event === null) {
      return {
        status: 400,
        body: "Event can't be found or it can't be rated!",
      }
    }

    const res = await ratingRepo.insert({ ...dto, createdAt: new Date(), userId: userServiceRes.data.szemely_id })
    return {
      status: 201,
      jsonBody: res.raw,
    }
  } catch (e) {
    context.log(e)
    return {
      status: 400,
      body: e,
    }
  }
}

app.http('ratings-create', {
  methods: ['POST'],
  route: 'ratings',
  handler: createRating,
})
