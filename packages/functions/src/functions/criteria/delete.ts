import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

export const deleteCriterion = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)
    const id = validateId(req)
    const criterionRepo = (await getAppDataSource(context)).getRepository(Criterion)
    const res = await criterionRepo.delete({ id })

    if (res.affected > 0) {
      context.log(`User #${user.szemely_id} deleted criterion #${id}`)
    }
    return {
      jsonBody: res,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('criteria-delete', {
  methods: ['DELETE'],
  route: 'criteria/{id}',
  handler: deleteCriterion,
})
