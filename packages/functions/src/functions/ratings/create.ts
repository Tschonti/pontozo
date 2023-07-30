import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { CreateEventRating, PontozoException, RatingRole, UserRole } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { getUserFromHeader } from '../../service/auth.service'
import Event from '../../typeorm/entities/Event'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
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
    const ads = await getAppDataSource()
    const eventRepo = ads.getRepository(Event)
    const ratingRepo = ads.getRepository(EventRating)

    const event = await eventRepo.findOne({ where: { id: dto.eventId, rateable: true } })
    if (event === null) {
      throw new PontozoException('A verseny nem található vagy nem értékelhető!', 404)
    }

    const res = await ratingRepo.insert({ ...dto, createdAt: new Date(), userId: user.szemely_id })
    return {
      status: 201,
      jsonBody: res.raw,
    }
  } catch (error) {
    return handleException(context, error)
  }
}

app.http('ratings-create', {
  methods: ['POST'],
  route: 'ratings',
  handler: createRating,
})
