import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { HttpResponseInit } from '@azure/functions/types/http'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'

export const getSeasons = async (_req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const seasonRepo = (await getAppDataSource()).getRepository(Season)
  try {
    const seasons = await seasonRepo.find({ relations: { categories: true } })
    return {
      jsonBody: seasons
    }
  } catch (error) {
    context.log(error)
    return {
      status: 500,
      body: error
    }
  }
}

app.http('seasons-getAll', {
  methods: ['GET'],
  route: 'seasons',
  handler: getSeasons
})
