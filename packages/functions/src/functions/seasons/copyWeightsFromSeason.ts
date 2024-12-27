import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { PontozoException } from '@pontozo/common'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import { CriterionWeight } from '../../typeorm/entities/CriterionWeight'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

export const copyWeights = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req, context)
    const destSeasonId = validateId(req)
    const sourceSeasonId = parseInt(req.params.sourceSeasonId)
    if (isNaN(sourceSeasonId)) {
      throw new PontozoException('Érvénytelen azonosító!', 400)
    }

    const ads = await getAppDataSource(context)
    const weightRepo = ads.getRepository(CriterionWeight)
    const seasonRepo = ads.getRepository(Season)
    const destSeasonPromise = seasonRepo.findOne({
      where: { id: destSeasonId },
      relations: { categories: { category: { criteria: true } } },
    })
    const sourceSeasonPromise = seasonRepo.findOne({
      where: { id: sourceSeasonId },
      relations: { categories: { category: { criteria: { criterion: { weights: true } } } } },
    })
    const [destSeason, sourceSeason] = await Promise.all([destSeasonPromise, sourceSeasonPromise])

    const destCriterionIds = new Set(destSeason.categories.map((stc) => stc.category.criteria.map((ctc) => ctc.criterionId)).flat())
    const criteriaToCopy = sourceSeason.categories
      .map((stc) =>
        stc.category.criteria
          .filter((ctc) => destCriterionIds.has(ctc.criterionId) && ctc.criterion.weights.length > 0)
          .map((ctc) => ({ ...ctc.criterion, weights: ctc.criterion.weights.find((cw) => cw.seasonId === sourceSeasonId) }))
      )
      .flat()
    const newWeights = criteriaToCopy.map((c) => ({
      criterionId: c.id,
      seasonId: destSeasonId,
      competitorWeight: c.weights?.competitorWeight ?? 1,
      organiserWeight: c.weights?.organiserWeight ?? 1,
    }))
    await weightRepo.save(newWeights)

    return {
      status: 204,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('seasons-copyWeights', {
  methods: ['PUT'],
  route: 'seasons/{id}/copyWeights/{sourceSeasonId}',
  handler: copyWeights,
})
