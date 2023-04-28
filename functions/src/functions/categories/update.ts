import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { In } from 'typeorm'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResServiceRes } from '../../util/httpRes'
import { myvalidate } from '../../util/validation'
import { CreateCategoryDTO } from './types/CreateCategory.dto'

export const updateCategory = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid id!'
    }
  }
  try {
    const dto = plainToClass(CreateCategoryDTO, await req.json())
    const errors = await myvalidate(dto)
    if (errors.length > 0) {
      return {
        status: 400,
        jsonBody: errors
      }
    }
    const ads = await getAppDataSource()
    const criteria = await ads.getRepository(Criterion).find({ where: { id: In(dto.criterionIds) } })
    let category = await ads.manager.findOne(Category, { where: { id } })
    if (category === null) {
      return {
        status: 404,
        body: 'Category not found!'
      }
    }
    category.name = dto.name
    category.description = dto.description
    category.criteria = criteria
    category = await ads.manager.save(category)

    return {
      jsonBody: category
    }
  } catch (e) {
    context.log(e)
    return {
      status: 400,
      body: e
    }
  }
}

app.http('categories-update', {
  methods: ['PUT'],
  route: 'categories/{id}',
  handler: updateCategory
})
