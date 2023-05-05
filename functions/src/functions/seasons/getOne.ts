import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'

export const getSeason = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const adminCheck = getUserFromHeaderAndAssertAdmin(req)
  if (adminCheck.isError) {
    return httpResFromServiceRes(adminCheck)
  }

  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid id!'
    }
  }
  const seasonRepo = (await getAppDataSource()).getRepository(Season)
  try {
    const season = await seasonRepo.findOne({ where: { id }, relations: { categories: { category: true } } })
    if (!season) {
      return {
        status: 404,
        body: 'Season not found!'
      }
    }
    return {
      jsonBody: { ...season, categories: season.categories.sort((stc1, stc2) => stc1.order - stc2.order).map((stc) => stc.category) }
    }
  } catch (error) {
    context.error(error)
    return {
      status: 500,
      body: error
    }
  }
}

app.http('seasons-getOne', {
  methods: ['GET'],
  route: 'seasons/{id}',
  handler: getSeason
})
