import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { HttpResponseInit } from '@azure/functions/types/http'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'

export const getCategories = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req, context)

    const categoryRepo = (await getAppDataSource(context)).getRepository(Category)
    const categories = await categoryRepo.find({ relations: { seasons: { season: true } } })
    return {
      jsonBody: categories.map((c) => ({ ...c, seasons: c.seasons.map((cts) => cts.season) })),
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('categories-getAll', {
  methods: ['GET'],
  route: 'categories',
  handler: getCategories,
})
