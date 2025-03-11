import { HttpRequest } from '@azure/functions'
import { PontozoException } from '@pontozo/common'
import { validate } from 'class-validator'

export const validateWithWhitelist = async (object: object): Promise<void> => {
  const errors = await validate(object, { whitelist: true })
  if (errors.length > 0) {
    throw new PontozoException(
      `Validation failed: ${errors
        .map((e) => Object.values(e.constraints ? e.constraints : []))
        .flat()
        .join(', ')}`,
      400
    )
  }
}

export const validateId = (req: HttpRequest): number => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    throw new PontozoException('Érvénytelen azonosító!', 400)
  }
  return id
}

export const validateBody = (req: HttpRequest) => {
  if (!req.body) {
    throw new PontozoException('A HTTP kérés törzse üres.', 400)
  }
}
