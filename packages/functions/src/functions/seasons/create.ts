import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { CreateSeason, PontozoException } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { Between, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import Season from '../../typeorm/entities/Season'
import { SeasonToCategory } from '../../typeorm/entities/SeasonToCategory'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateBody, validateWithWhitelist } from '../../util/validation'

export const createSeason = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)
    validateBody(req)
    const dto = plainToClass(CreateSeason, await req.json())
    await validateWithWhitelist(dto)

    const ads = await getAppDataSource()
    const conflictingSeasons = await ads.getRepository(Season).find({
      where: [
        { startDate: Between(dto.startDate, dto.endDate) },
        { endDate: Between(dto.startDate, dto.endDate) },
        { startDate: LessThanOrEqual(dto.startDate), endDate: MoreThanOrEqual(dto.endDate) },
      ],
    })
    if (conflictingSeasons.length > 0) {
      throw new PontozoException('A szezon ütközik egy másikkal!', 400)
    }
    const categories = await ads.getRepository(Category).find({ where: { id: In(dto.categoryIds) } })
    let season = new Season()
    season.name = dto.name
    season.startDate = dto.startDate
    const endDate = new Date(dto.endDate)
    endDate.setHours(23, 59, 59)
    season.endDate = endDate
    const stcs = categories.map((cat) => {
      const stc = new SeasonToCategory()
      stc.category = cat
      stc.order = dto.categoryIds.indexOf(cat.id)
      return stc
    })
    season.categories = stcs
    season = await ads.manager.save(season)

    context.log(`User #${user.szemely_id} created season #${season.id}`)
    return {
      jsonBody: season,
      status: 201,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('seasons-create', {
  methods: ['POST'],
  route: 'seasons',
  handler: createSeason,
})
