import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { PontozoException } from '../../../../common/src'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

export const getURA = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req)

    const id = validateId(req)
    const uraRepo = (await getAppDataSource()).getRepository(UserRoleAssignment)
    const ura = await uraRepo.findOneBy({ id })
    if (!ura) {
      throw new PontozoException('Szerepkör kinevezés nem található!', 404)
    }
    return {
      jsonBody: ura,
    }
  } catch (error) {
    handleException(context, error)
  }
}

app.http('uras-getOne', {
  methods: ['GET'],
  route: 'uras/{id}',
  handler: getURA,
})
