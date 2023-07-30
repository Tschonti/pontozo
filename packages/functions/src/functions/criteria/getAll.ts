import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { HttpResponseInit } from '@azure/functions/types/http'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'

export const getCriteria = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req)
    const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
    const criteria = await criterionRepo.find()
    return {
      jsonBody: criteria,
    }
  } catch (error) {
    return handleException(context, error)
  }
}

app.http('criteria-getAll', {
  methods: ['GET'],
  route: 'criteria',
  handler: getCriteria,
})
