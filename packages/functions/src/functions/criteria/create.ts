import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { CreateCriteria, PontozoException, RatingRole } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateBody, validateWithWhitelist } from '../../util/validation'

export const createCriteria = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req)
    validateBody(req)
    const dto = plainToClass(CreateCriteria, await req.json())
    await validateWithWhitelist(dto)

    if (
      (dto.roles.includes(RatingRole.COMPETITOR) && !dto.competitorWeight) ||
      (dto.roles.includes(RatingRole.ORGANISER) && !dto.organiserWeight)
    ) {
      throw new PontozoException('A szempont súlyát kötelező megadni!', 400)
    }

    const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
    const res = await criterionRepo.insert({ ...dto, roles: JSON.stringify(dto.roles) })
    return {
      jsonBody: res,
      status: 201,
    }
  } catch (error) {
    return handleException(context, error)
  }
}

app.http('criteria-create', {
  methods: ['POST'],
  route: 'criteria',
  handler: createCriteria,
})
