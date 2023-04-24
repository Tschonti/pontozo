import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { In } from 'typeorm'
import Category from '../../typeorm/entities/Category'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { myvalidate } from '../../util/validation'
import { CreateCategoryDTO } from './types/CreateCategory.dto'

export const createCategory = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  if (!req.body) {
    return {
      status: 400,
      body: 'No body attached to POST query.'
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
    let category = new Category()
    category.name = dto.name
    category.description = dto.description
    category.criteria = criteria
    category = await ads.manager.save(category)

    return {
      jsonBody: category,
      status: 201
    }
  } catch (e) {
    context.log(e)
    return {
      status: 400,
      body: e
    }
  }
}

app.http('categories-create', {
  methods: ['POST'],
  route: 'categories',
  handler: createCategory
})
