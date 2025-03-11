import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { CreateSeason, PontozoException } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { In } from 'typeorm'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import Season from '../../typeorm/entities/Season'
import { SeasonToCategory } from '../../typeorm/entities/SeasonToCategory'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateBody, validateId, validateWithWhitelist } from '../../util/validation'

export const updateSeason = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)
    validateBody(req)
    const id = validateId(req)
    const dto = plainToClass(CreateSeason, await req.json())
    await validateWithWhitelist(dto)
    const ads = await getAppDataSource(context)
    const categories = await ads.getRepository(Category).find({ where: { id: In(dto.categoryIds) } })
    let season = await ads.manager.findOne(Season, { where: { id }, relations: { categories: { category: true } } })
    if (season === null) {
      throw new PontozoException('A szezon nem található!', 404)
    }
    if (season.startDate < new Date()) {
      throw new PontozoException('Ez a szezon már nem szerkeszthető, mert már elkezdődött!', 400)
    }
    season.name = dto.name
    season.startDate = dto.startDate
    const endDate = new Date(dto.endDate)
    endDate.setHours(23, 59, 59)
    season.endDate = endDate
    const newStcs: SeasonToCategory[] = []
    season.categories.forEach(async (stc) => {
      if (dto.categoryIds.includes(stc.category.id)) {
        newStcs.push(stc)
      } else {
        await ads.manager.delete(SeasonToCategory, stc)
      }
    })
    newStcs.forEach((stc) => {
      if (stc.order !== dto.categoryIds.indexOf(stc.category.id)) {
        stc.order = dto.categoryIds.indexOf(stc.category.id)
      }
    })
    dto.categoryIds.forEach((cId, idx) => {
      if (!newStcs.map((stc) => stc.category.id).includes(cId)) {
        const newStc = new SeasonToCategory()
        const category = categories.find((c) => c.id === cId)
        if (category) {
          newStc.category = category
          newStc.order = idx
          newStcs.push(newStc)
        }
      }
    })
    season.categories = newStcs
    season = await ads.manager.save(season)

    context.log(`User #${user.szemely_id} updated season #${season.id}`)
    return {
      jsonBody: season,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('seasons-update', {
  methods: ['PUT'],
  route: 'seasons/{id}',
  handler: updateSeason,
})
