import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { CategoryWithCriteria, EntityWithEditableIndicator } from '@pontozo/common'

export const getCategory = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const adminCheck = await getUserFromHeaderAndAssertAdmin(req)
  if (adminCheck.isError) {
    return httpResFromServiceRes(adminCheck)
  }

  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid id!',
    }
  }
  const categoryRepo = (await getAppDataSource()).getRepository(Category)
  try {
    const category = await categoryRepo.findOne({ where: { id }, relations: { criteria: { criterion: true }, seasons: { season: true } } })
    if (!category) {
      return {
        status: 404,
        body: 'Category not found!',
      }
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
    context.error(error)
    return {
      status: 500,
      body: error,
    }
  }
}

app.http('categories-getOne', {
  methods: ['GET'],
  route: 'categories/{id}',
  handler: getCategory,
})
