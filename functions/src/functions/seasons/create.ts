import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { Between, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResServiceRes } from '../../util/httpRes'
import { myvalidate } from '../../util/validation'
import { CreateSeasonDTO } from './types/CreateSeason.dto'

export const createSeason = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const adminCheck = getUserFromHeaderAndAssertAdmin(req)
  if (adminCheck.isError) {
    return httpResServiceRes(adminCheck)
  }

  if (!req.body) {
    return {
      status: 400,
      body: 'No body attached to POST query.'
    }
  }
  const dto = plainToClass(CreateSeasonDTO, await req.json())
  const errors = await myvalidate(dto)
  if (errors.length > 0) {
    return {
      status: 400,
      jsonBody: errors
    }
  }
  try {
    const ads = await getAppDataSource()
    const conflictingSeasons = await ads.getRepository(Season).find({
      where: [
        { startDate: Between(dto.startDate, dto.endDate) },
        { endDate: Between(dto.startDate, dto.endDate) },
        { startDate: LessThanOrEqual(dto.startDate), endDate: MoreThanOrEqual(dto.endDate) }
      ]
    })
    if (conflictingSeasons.length > 0) {
      return {
        status: 400,
        body: 'This season conflicts with another season!'
      }
    }
    const categories = await ads.getRepository(Category).find({ where: { id: In(dto.categoryIds) } })
    let season = new Season()
    season.name = dto.name
    season.startDate = dto.startDate
    season.endDate = dto.endDate
    season.categories = categories
    season = await ads.manager.save(season)

    return {
      jsonBody: season,
      status: 201
    }
  } catch (e) {
    context.log(e)
    return {
      status: 500,
      body: e
    }
  }
}

app.http('seasons-create', {
  methods: ['POST'],
  route: 'seasons',
  handler: createSeason
})
