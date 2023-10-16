import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { HttpResponseInit } from '@azure/functions/types/http'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'

export const getURAs = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req, context)

    const urasRepo = (await getAppDataSource(context)).getRepository(UserRoleAssignment)
    const uras = await urasRepo.find()

    return {
      jsonBody: uras,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('uras-getAll', {
  methods: ['GET'],
  route: 'uras',
  handler: getURAs,
})
