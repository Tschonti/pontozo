import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { EntityWithEditableIndicator, PontozoException } from '@pontozo/common'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

export const getCriterion = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req)
    const id = validateId(req)
    const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
    const criterion = await criterionRepo.findOne({ where: { id }, relations: { categories: { category: { seasons: { season: true } } } } })
    if (!criterion) {
      throw new PontozoException('A szempont nem található!', 404)
    }
    const { categories, ...plainCriterion } = criterion
    return {
      jsonBody: {
        ...plainCriterion,
        roles: JSON.parse(criterion.roles),
        editable: !categories.some(({ category }) => category.seasons.some(({ season }) => season.startDate < new Date())),
      } as EntityWithEditableIndicator<Criterion>,
    }
  } catch (error) {
    handleException(context, error)
  }
}

app.http('criteria-getOne', {
  methods: ['GET'],
  route: 'criteria/{id}',
  handler: getCriterion,
})
