import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { PontozoException } from '@pontozo/common'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import { CategoryToCriterion } from '../../typeorm/entities/CategoryToCriterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

export const duplicateCategory = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)
    const id = validateId(req)

    const ads = await getAppDataSource(context)
    const oldCategory = await ads.manager.findOne(Category, {
      where: { id },
      relations: { criteria: true },
    })
    if (oldCategory === null) {
      throw new PontozoException('A kategória nem található!', 404)
    }

    const newCategory = new Category()
    newCategory.name = oldCategory.name
    newCategory.description = oldCategory.description
    newCategory.criteria = oldCategory.criteria.map((ctc) => {
      const newCtc = new CategoryToCriterion()
      newCtc.criterionId = ctc.criterionId
      newCtc.order = ctc.order
      return newCtc
    })
    await ads.manager.save(newCategory)

    context.log(`User #${user.szemely_id} duplicated category #${oldCategory.id}`)
    return {
      jsonBody: newCategory,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('categories-duplicate', {
  methods: ['POST'],
  route: 'categories/{id}/duplicate',
  handler: duplicateCategory,
})
