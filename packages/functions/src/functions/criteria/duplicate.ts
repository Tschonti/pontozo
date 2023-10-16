import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { CreateResponse, PontozoException } from '@pontozo/common'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

export const duplicateCriterion = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)
    const id = validateId(req)
    const criterionRepo = (await getAppDataSource(context)).getRepository(Criterion)
    const criterion = await criterionRepo.findOne({ where: { id } })
    if (!criterion) {
      throw new PontozoException('A szempont nem található!', 404)
    }
    const { id: criterionId, ...rest } = criterion
    const insertRes = await criterionRepo.insert({ ...rest })

    context.log(`User #${user.szemely_id} duplicated criterion #${id}, new criterionId: ${insertRes.identifiers[0].id}`)
    return {
      jsonBody: insertRes.identifiers as CreateResponse[],
      status: 201,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('criteria-duplicate', {
  methods: ['POST'],
  route: 'criteria/{id}/duplicate',
  handler: duplicateCriterion,
})
