import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { HttpResponseInit } from '@azure/functions/types/http'
import Category from '../../typeorm/entities/Category'
import { getAppDataSource } from '../../typeorm/getConfig'

export const getCategories = async (_req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const categoryRepo = (await getAppDataSource()).getRepository(Category)
  try {
    const categories = await categoryRepo.find({ relations: { criteria: true } })
    return {
      jsonBody: categories
    }
  } catch (error) {
    context.log(error)
    return {
      status: 500,
      body: error
    }
  }
}

app.http('categories-getAll', {
  methods: ['GET'],
  route: 'categories',
  handler: getCategories
})
