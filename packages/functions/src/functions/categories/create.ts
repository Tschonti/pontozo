import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { In } from 'typeorm'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import { CategoryToCriterion } from '../../typeorm/entities/CategoryToCriterion'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { validateWithWhitelist } from '../../util/validation'
import { CreateCategory } from '@pontozo/types'

export const createCategory = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const adminCheck = await getUserFromHeaderAndAssertAdmin(req)
  if (adminCheck.isError) {
    return httpResFromServiceRes(adminCheck)
  }

  if (!req.body) {
    return {
      status: 400,
      body: 'No body attached to POST query.',
    }
  }
  try {
    const dto = plainToClass(CreateCategory, await req.json())
    const errors = await validateWithWhitelist(dto)
    if (errors.length > 0) {
      return {
        status: 400,
        jsonBody: errors,
      }
    }
    const ads = await getAppDataSource()
    const criteria = await ads.getRepository(Criterion).find({ where: { id: In(dto.criterionIds) } })
    let category = new Category()
    category.name = dto.name
    category.description = dto.description
    const ctcs = criteria.map((criterion) => {
      const ctc = new CategoryToCriterion()
      ctc.criterion = criterion
      ctc.order = dto.criterionIds.indexOf(criterion.id)
      return ctc
    })
    category.criteria = ctcs
    category = await ads.manager.save(category)

    return {
      jsonBody: category,
      status: 201,
    }
  } catch (e) {
    context.log(e)
    return {
      status: 400,
      body: e,
    }
  }
}

app.http('categories-create', {
  methods: ['POST'],
  route: 'categories',
  handler: createCategory,
})
