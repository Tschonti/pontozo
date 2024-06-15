import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { CriterionWithSeason, EntityWithEditableIndicator, PontozoException } from '@pontozo/common'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { PontozoResponse } from '../../util/pontozoResponse'
import { validateId } from '../../util/validation'

export const getCriterion = async (
  req: HttpRequest,
  context: InvocationContext
): Promise<PontozoResponse<EntityWithEditableIndicator<CriterionWithSeason>>> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req, context)
    const id = validateId(req)
    const criterionRepo = (await getAppDataSource(context)).getRepository(Criterion)
    const criterion = await criterionRepo.findOne({ where: { id }, relations: { categories: { category: { seasons: { season: true } } } } })
    if (!criterion) {
      throw new PontozoException('A szempont nem található!', 404)
    }
    const { categories, ...plainCriterion } = criterion
    const seasons = categories.map((ctc) => ctc.category.seasons.map((stc) => stc.season)).flat()
    return {
      jsonBody: {
        ...plainCriterion,
        seasons: [...new Set(seasons)],
        roles: JSON.parse(criterion.roles),
        editable: !categories.some(({ category }) => category.seasons.some(({ season }) => season.startDate < new Date())),
      },
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('criteria-getOne', {
  methods: ['GET'],
  route: 'criteria/{id}',
  handler: getCriterion,
})
