import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'

export const getCriterion = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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
  const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
  try {
    const criteria = await criterionRepo.findOneBy({ id })
    if (!criteria) {
      return {
        status: 404,
        body: 'Criterion not found!'
      }
    }
    return {
      jsonBody: { ...criteria, roles: JSON.parse(criteria.roles) } as Criterion
    }
  } catch (error) {
    context.error(error)
    return {
      status: 500,
      body: error
    }
  }
}

app.http('criteria-getOne', {
  methods: ['GET'],
  route: 'criteria/{id}',
  handler: getCriterion
})
