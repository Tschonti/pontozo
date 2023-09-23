import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { PontozoException, SeasonWithCategories } from '@pontozo/common'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

export const getSeason = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req, context)
    const id = validateId(req)
    const seasonRepo = (await getAppDataSource()).getRepository(Season)
    const season = await seasonRepo.findOne({ where: { id }, relations: { categories: { category: true } } })
    if (!season) {
      throw new PontozoException('A szezon nem található!', 404)
    }
    return {
      jsonBody: {
        ...season,
        categories: season.categories.sort((stc1, stc2) => stc1.order - stc2.order).map((stc) => stc.category),
      } as SeasonWithCategories,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('seasons-getOne', {
  methods: ['GET'],
  route: 'seasons/{id}',
  handler: getSeason,
})
