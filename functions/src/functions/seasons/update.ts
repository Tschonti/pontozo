import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { In } from 'typeorm'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import Season from '../../typeorm/entities/Season'
import { SeasonToCategory } from '../../typeorm/entities/SeasonToCategory'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { myvalidate } from '../../util/validation'
import { CreateSeasonDTO } from './types/CreateSeason.dto'

export const updateSeason = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const adminCheck = await getUserFromHeaderAndAssertAdmin(req)
  if (adminCheck.isError) {
    return httpResFromServiceRes(adminCheck)
  }

  if (!req.body) {
    return {
      status: 400,
      body: 'No body attached to POST query.'
    }
  }
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid id!'
    }
  }
  try {
    const dto = plainToClass(CreateSeasonDTO, await req.json())
    const errors = await myvalidate(dto)
    if (errors.length > 0) {
      return {
        status: 400,
        jsonBody: errors
      }
    }
    const ads = await getAppDataSource()
    const categories = await ads.getRepository(Category).find({ where: { id: In(dto.categoryIds) } })
    let season = await ads.manager.findOne(Season, { where: { id }, relations: { categories: { category: true } } })
    if (season === null) {
      return {
        status: 404,
        body: 'Category not found!'
      }
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
        newStc.category = categories.find((c) => c.id === cId)
        newStc.order = idx
        newStcs.push(newStc)
      }
    })
    season.categories = newStcs
    season = await ads.manager.save(season)

    return {
      jsonBody: season
    }
  } catch (e) {
    context.log(e)
    return {
      status: 400,
      body: e
    }
  }
}

app.http('seasons-update', {
  methods: ['PUT'],
  route: 'seasons/{id}',
  handler: updateSeason
})
