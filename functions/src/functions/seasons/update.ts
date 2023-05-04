import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { In } from 'typeorm'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { myvalidate } from '../../util/validation'
import { CreateSeasonDTO } from './types/CreateSeason.dto'

export const updateSeason = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const adminCheck = getUserFromHeaderAndAssertAdmin(req)
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
    let season = await ads.manager.findOne(Season, { where: { id } })
    if (season === null) {
      return {
        status: 404,
        body: 'Category not found!'
      }
    }
    season.name = dto.name
    season.startDate = dto.startDate
    season.endDate = dto.endDate
    season.categories = categories
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
