import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

export const deleteCriterion = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req)
    const id = validateId(req)
    const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
    const res = await criterionRepo.delete({ id })
    return {
      jsonBody: res,
    }
  } catch (error) {
    return handleException(context, error)
  }
}

app.http('criteria-delete', {
  methods: ['DELETE'],
  route: 'criteria/{id}',
  handler: deleteCriterion,
})
