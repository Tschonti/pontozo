import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { getUserFromHeader } from '../../service/auth.service'
import { getOneEvent } from '../../service/mtfsz.service'
import EventRating, { RatingRole } from '../../typeorm/entities/EventRating'
import { UserRole } from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResServiceRes } from '../../util/httpRes'
import { myvalidate } from '../../util/validation'
import { CreateEventRatingDto } from './types/createEventRating.dto'

export const createRating = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  if (!req.body) {
    return {
      status: 400,
      body: `No body attached to POST query.`
    }
  }

  const userServiceRes = getUserFromHeader(req)
  if (userServiceRes.isError) {
    return httpResServiceRes(userServiceRes)
  }

  try {
    const dto = plainToClass(CreateEventRatingDto, await req.json())
    const errors = await myvalidate(dto)
    if (errors.length > 0) {
      return {
        status: 400,
        jsonBody: errors
      }
    }

    if (
      (dto.role === RatingRole.COACH && !userServiceRes.data.roles.includes(UserRole.COACH)) ||
      (dto.role === RatingRole.JURY && !!userServiceRes.data.roles.includes(UserRole.JURY))
    ) {
      return {
        status: 403,
        body: 'You are not allowed to rate an event with this role'
      }
    }

    const { isError } = await getOneEvent(dto.eventId)
    if (isError) {
      return {
        status: 400,
        body: "Event doesn't exist in MTFSZ DB or is not ranked!"
      }
    }
    const ratingRepo = (await getAppDataSource()).getRepository(EventRating)
    const res = await ratingRepo.insert({ ...dto, createdAt: new Date(), userId: userServiceRes.data.szemely_id })
    return {
      status: 201,
      jsonBody: res.raw
    }
  } catch (e) {
    context.log(e)
    return {
      status: 400,
      body: e
    }
  }
}

app.http('ratings-create', {
  methods: ['POST'],
  route: 'ratings',
  handler: createRating
})
