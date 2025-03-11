import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { CreateCriterionWeight, Criterion, PontozoException, RatingRole } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import { CriterionWeight } from '../../typeorm/entities/CriterionWeight'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateBody, validateId, validateWithWhitelist } from '../../util/validation'

/**
 * Function to update the weights for a specific season and criterion.
 * Organiser and competitor weights have to be sent in the request body.
 * Called when an admin finishes typing in any field on the season weight adjustment page.
 */
export const setWeights = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req, context)
    const seasonId = validateId(req)
    const criterionId = parseInt(req.params.critId)
    if (isNaN(criterionId)) {
      throw new PontozoException('Érvénytelen azonosító!', 400)
    }
    validateBody(req)
    const dto = plainToClass(CreateCriterionWeight, await req.json())
    await validateWithWhitelist(dto)
    const ads = await getAppDataSource(context)
    const weightRepo = ads.getRepository(CriterionWeight)
    const seasonRepo = ads.getRepository(Season)
    const weights = await weightRepo.findOne({ where: { seasonId, criterionId } })
    if (weights) {
      if (dto.organiserWeight !== undefined) weights.organiserWeight = dto.organiserWeight
      if (dto.competitorWeight !== undefined) weights.competitorWeight = dto.competitorWeight
      weightRepo.save(weights)
    } else {
      const season = await seasonRepo.findOne({
        where: { id: seasonId },
        relations: { categories: { category: { criteria: { criterion: true } } } },
      })
      if (!season) {
        throw new PontozoException('A szezon nem található!', 404)
      }
      let criterion: Criterion | null = null
      for (const stc of season.categories) {
        for (const ctc of stc.category.criteria) {
          if (ctc.criterionId === criterionId) {
            criterion = { ...ctc.criterion, roles: JSON.parse(ctc.criterion.roles) }
            break
          }
        }
        if (criterion) break
      }
      if (!criterion) {
        throw new PontozoException('A szempont nem található a szenzonban!', 404)
      }
      const orgAllowed = criterion.roles.includes(RatingRole.ORGANISER) || criterion.roles.includes(RatingRole.JURY)
      const compAllowed = criterion.roles.includes(RatingRole.COMPETITOR) || criterion.roles.includes(RatingRole.COACH)
      await weightRepo.insert({
        seasonId,
        criterionId,
        organiserWeight: dto.organiserWeight ?? (orgAllowed ? 1 : 0),
        competitorWeight: dto.competitorWeight ?? (compAllowed ? 1 : 0),
      })
    }

    return {
      status: 204,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('seasons-setWeights', {
  methods: ['PUT'],
  route: 'seasons/{id}/weights/{critId}',
  handler: setWeights,
})
