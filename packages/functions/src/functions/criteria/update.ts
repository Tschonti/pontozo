import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { CreateCriteria, PontozoException } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateBody, validateId, validateWithWhitelist } from '../../util/validation'

export const updateCriteria = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)
    validateBody(req)
    const id = validateId(req)
    const dto = plainToClass(CreateCriteria, await req.json())
    await validateWithWhitelist(dto)

    const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
    const criterion = await criterionRepo.findOne({ where: { id }, relations: { categories: { category: { seasons: { season: true } } } } })
    if (criterion === null) {
      throw new PontozoException('A szempont nem található!', 404)
    }
    if (criterion.categories.some(({ category }) => category.seasons.some(({ season }) => season.startDate < new Date()))) {
      throw new PontozoException('Ezt a szempontot már nem lehet szerkeszteni, mert része egy olyan szezonnak, ami már elkezdődött!', 400)
    }
    const res = await criterionRepo.update({ id }, { ...dto, roles: JSON.stringify(dto.roles) })

    context.log(`User #${user.szemely_id} updated criterion #${id}`)
    return {
      jsonBody: res,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('criteria-update', {
  methods: ['PUT'],
  route: 'criteria/{id}',
  handler: updateCriteria,
})
