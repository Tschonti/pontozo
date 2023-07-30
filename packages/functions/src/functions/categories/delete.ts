import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

export const deleteCategory = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req)
    const id = validateId(req)
    const categoryRepo = (await getAppDataSource()).getRepository(Category)
    const res = await categoryRepo.delete({ id })
    return {
      jsonBody: res,
    }
  } catch (error) {
    return handleException(context, error)
  }
}

app.http('categories-delete', {
  methods: ['DELETE'],
  route: 'categories/{id}',
  handler: deleteCategory,
})
