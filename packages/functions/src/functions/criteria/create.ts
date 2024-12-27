import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { CreateCriteria } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateBody, validateWithWhitelist } from '../../util/validation'

export const createCriteria = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)
    validateBody(req)
    const dto = plainToClass(CreateCriteria, await req.json())
    await validateWithWhitelist(dto)

    const criterionRepo = (await getAppDataSource(context)).getRepository(Criterion)
    const res = await criterionRepo.insert({ ...dto, roles: JSON.stringify(dto.roles) })

    context.log(`User #${user.szemely_id} created criterion #${res.identifiers[0].id}`)
    return {
      jsonBody: res,
      status: 201,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('criteria-create', {
  methods: ['POST'],
  route: 'criteria',
  handler: createCriteria,
})
