import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'

export const deleteSeason = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid id!'
    }
  }
  const seasonRepo = (await getAppDataSource()).getRepository(Season)
  try {
    const res = await seasonRepo.delete({ id })
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

app.http('seasons-delete', {
  methods: ['DELETE'],
  route: 'seasons/{id}',
  handler: deleteSeason
})
