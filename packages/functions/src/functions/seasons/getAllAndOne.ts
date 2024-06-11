import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { AllSeasonsAndOne } from '@pontozo/common'
import { LessThan } from 'typeorm'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'

export const getAllAndOneSeasons = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const now = new Date(2026, 3, 23)
    const seasonId = req.query.get('seasonId')
    const ads = await getAppDataSource(context)
    const seasonRepo = ads.getRepository(Season)
    const seasons = await seasonRepo.find({ where: { startDate: LessThan(now) }, order: { endDate: 'DESC' } })
    let selectedSeason: Season
    if (seasonId) {
      selectedSeason = seasons.find((s) => s.id === parseInt(seasonId))
    }
    if (!selectedSeason) {
      selectedSeason = seasons.find((s) => new Date(s.startDate) < now && new Date(s.endDate) > now) ?? seasons[0]
    }
    selectedSeason = await seasonRepo.findOne({
      where: { id: selectedSeason.id },
      relations: { categories: { category: { criteria: { criterion: true } } } },
    })
    const res: AllSeasonsAndOne = {
      selectedSeason: {
        ...selectedSeason,
        categories: selectedSeason.categories.map((stc) => ({
          ...stc.category,
          criteria: stc.category.criteria.map((ctc) => ({ ...ctc.criterion, roles: JSON.parse(ctc.criterion.roles) })),
        })),
      },
      allSeasons: seasons,
    }
    return { jsonBody: res }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('seasons-getAllAndOne', {
  methods: ['GET'],
  route: 'seasons/getAll',
  handler: getAllAndOneSeasons,
})
