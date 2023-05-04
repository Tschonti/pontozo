import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { HttpResponseInit } from '@azure/functions/types/http'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'

export const getCriteria = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const adminCheck = getUserFromHeaderAndAssertAdmin(req)
  if (adminCheck.isError) {
    return httpResFromServiceRes(adminCheck)
  }

  const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
  try {
    const criteria = await criterionRepo.find()
    return {
      jsonBody: criteria
    }
  } catch (error) {
    context.log(error)
    return {
      status: 500,
      body: error
    }
  }
}

app.http('criteria-getAll', {
  methods: ['GET'],
  route: 'criteria',
  handler: getCriteria
})
