import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { PontozoException, SeasonWithCriterionWeights } from '@pontozo/common'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { PontozoResponse } from '../../util/pontozoResponse'
import { validateId } from '../../util/validation'

export const getWeights = async (req: HttpRequest, context: InvocationContext): Promise<PontozoResponse<SeasonWithCriterionWeights>> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req, context)
    const id = validateId(req)

    const ads = await getAppDataSource(context)
    const seasonRepo = ads.getRepository(Season)
    const season = await seasonRepo.findOne({
      where: { id },
      relations: { categories: { category: { criteria: { criterion: { weights: true } } } } },
    })

    if (!season) {
      throw new PontozoException('A szezon nem található!', 404)
    }

    return {
      jsonBody: {
        ...season,
        categories: season.categories.map((stc) => ({
          ...stc.category,
          criteria: stc.category.criteria.map((ctc) => ({
            ...ctc.criterion,
            weights: ctc.criterion.weights.find((cw) => cw.seasonId === id),
            roles: JSON.parse(ctc.criterion.roles),
          })),
        })),
      },
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('seasons-getWeights', {
  methods: ['GET'],
  route: 'seasons/{id}/weights',
  handler: getWeights,
})
