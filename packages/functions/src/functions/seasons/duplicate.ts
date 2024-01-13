import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { PontozoException } from '@pontozo/common'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Season from '../../typeorm/entities/Season'
import { SeasonToCategory } from '../../typeorm/entities/SeasonToCategory'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

export const duplicateSeason = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)
    const id = validateId(req)

    const ads = await getAppDataSource(context)
    const oldSeason = await ads.manager.findOne(Season, {
      where: { id },
      relations: { categories: true },
    })
    if (oldSeason === null) {
      throw new PontozoException('A szezon nem található!', 404)
    }

    const newSeason = new Season()
    newSeason.name = oldSeason.name + ' másolata'
    newSeason.startDate = new Date(Date.now() + 1000 * 60 * 60 * 24)
    newSeason.endDate = new Date(newSeason.startDate.getTime() + 1000 * 60 * 60 * 24 * 365)

    newSeason.categories = oldSeason.categories.map((stc) => {
      const newCtc = new SeasonToCategory()
      newCtc.categoryId = stc.categoryId
      newCtc.order = stc.order
      return newCtc
    })
    await ads.manager.save(newSeason)

    context.log(`User #${user.szemely_id} duplicated season #${oldSeason.id}`)
    return {
      jsonBody: newSeason,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('season-duplicate', {
  methods: ['POST'],
  route: 'seasons/{id}/duplicate',
  handler: duplicateSeason,
})
