import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { myvalidate } from '../../util/validation'
import { CreateCriteriaDTO } from './types/createCriteria.dto'

export const updateCriteria = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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

  const dto = plainToClass(CreateCriteriaDTO, await req.json())
  const errors = await myvalidate(dto)
  if (errors.length > 0) {
    return {
      status: 400,
      jsonBody: errors
    }
  }
  try {
    const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
    const criterion = await criterionRepo.findOne({ where: { id }, relations: { categories: { category: { seasons: { season: true } } } } })
    if (criterion === null) {
      return {
        status: 404,
        body: 'Criterion not found!'
      }
    }
    if (criterion.categories.some(({ category }) => category.seasons.some(({ season }) => season.startDate < new Date()))) {
      return {
        status: 400,
        body: "This criterion can no longer be edited, because it's part of a season that has already started!"
      }
    }
    const res = await criterionRepo.update({ id }, { ...dto, roles: JSON.stringify(dto.roles) })
    return {
      jsonBody: res
    }
  } catch (e) {
    context.log(e)
    return {
      status: 400,
      body: e
    }
  }
}

app.http('criteria-update', {
  methods: ['PUT'],
  route: 'criteria/{id}',
  handler: updateCriteria
})
