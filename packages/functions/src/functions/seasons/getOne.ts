import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { PontozoException, SeasonWithCategories } from '@pontozo/common'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { PontozoResponse } from '../../util/pontozoResponse'
import { validateId } from '../../util/validation'

export const getSeason = async (req: HttpRequest, context: InvocationContext): Promise<PontozoResponse<SeasonWithCategories>> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req, context)
    const id = validateId(req)
    const seasonRepo = (await getAppDataSource(context)).getRepository(Season)
    const season = await seasonRepo.findOne({ where: { id }, relations: { categories: { category: true } } })
    if (!season) {
      throw new PontozoException('A szezon nem található!', 404)
    }
    return {
      jsonBody: {
        ...season,
        categories: season.categories.sort((stc1, stc2) => stc1.order - stc2.order).map((stc) => stc.category),
      },
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
