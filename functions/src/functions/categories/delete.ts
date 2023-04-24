import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import Category from '../../typeorm/entities/Category'
import { getAppDataSource } from '../../typeorm/getConfig'

export const deleteCategory = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid id!'
    }
  }
  const categoryRepo = (await getAppDataSource()).getRepository(Category)
  try {
    const res = await categoryRepo.delete({ id })
    return {
      jsonBody: res
    }
  } catch (error) {
    context.error(error)
    return {
      status: 500,
      body: error
    }
  }
}

app.http('categories-delete', {
  methods: ['DELETE'],
  route: 'categories/{id}',
  handler: deleteCategory
})
