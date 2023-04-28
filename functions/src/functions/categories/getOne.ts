import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResServiceRes } from '../../util/httpRes'

export const getCategory = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const adminCheck = getUserFromHeaderAndAssertAdmin(req)
  if (adminCheck.isError) {
    return httpResServiceRes(adminCheck)
  }

  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid id!'
    }
  }
  const categoryRepo = (await getAppDataSource()).getRepository(Category)
  try {
    const category = await categoryRepo.findOneBy({ id })
    if (!category) {
      return {
        status: 404,
        body: 'Category not found!'
      }
    }
    return {
      jsonBody: category
    }
  } catch (error) {
    context.error(error)
    return {
      status: 500,
      body: error
    }
  }
}

app.http('categories-getOne', {
  methods: ['GET'],
  route: 'categories/{id}',
  handler: getCategory
})
