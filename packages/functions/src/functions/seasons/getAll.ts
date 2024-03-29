import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { HttpResponseInit } from '@azure/functions/types/http'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'

export const getSeasons = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req, context)

    const seasonRepo = (await getAppDataSource(context)).getRepository(Season)
    const seasons = await seasonRepo.find({ relations: { categories: true } })
    return {
      jsonBody: seasons,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('seasons-getAll', {
  methods: ['GET'],
  route: 'seasons',
  handler: getSeasons,
})
