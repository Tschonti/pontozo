import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { CreateCategory } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { In } from 'typeorm'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import { CategoryToCriterion } from '../../typeorm/entities/CategoryToCriterion'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { validateBody, validateWithWhitelist } from '../../util/validation'

import { handleException } from '../../util/handleException'

export const createCategory = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)
    validateBody(req)
    const dto = plainToClass(CreateCategory, await req.json())
    await validateWithWhitelist(dto)

    const ads = await getAppDataSource(context)
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

    context.log(`User #${user.szemely_id} created category #${category.id}`)
    return {
      jsonBody: category,
      status: 201,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('categories-create', {
  methods: ['POST'],
  route: 'categories',
  handler: createCategory,
})
