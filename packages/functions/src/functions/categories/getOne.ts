import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { CategoryWithCriteria, EntityWithEditableIndicator, PontozoException } from '@pontozo/common'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

export const getCategory = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req, context)
    const id = validateId(req)
    const categoryRepo = (await getAppDataSource()).getRepository(Category)
    const category = await categoryRepo.findOne({ where: { id }, relations: { criteria: { criterion: true }, seasons: { season: true } } })
    if (!category) {
      throw new PontozoException('A kategória nem taláálható!', 404)
    }
    const { seasons, ...plainCategory } = category
    return {
      jsonBody: {
        ...plainCategory,
        criteria: category.criteria
          .sort((ctc1, ctc2) => ctc1.order - ctc2.order)
          .map((ctc) => ({ ...ctc.criterion, roles: JSON.parse(ctc.criterion.roles) })),
        editable: !seasons.some(({ season }) => season.startDate < new Date()),
      } as EntityWithEditableIndicator<CategoryWithCriteria>,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('categories-getOne', {
  methods: ['GET'],
  route: 'categories/{id}',
  handler: getCategory,
})
