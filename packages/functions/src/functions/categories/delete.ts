import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

export const deleteCategory = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)
    const id = validateId(req)
    const categoryRepo = (await getAppDataSource(context)).getRepository(Category)
    const res = await categoryRepo.delete({ id })

    if (res.affected > 0) {
      context.log(`User #${user.szemely_id} deleted category #${id}`)
    }
    return {
      jsonBody: res,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('categories-delete', {
  methods: ['DELETE'],
  route: 'categories/{id}',
  handler: deleteCategory,
})
