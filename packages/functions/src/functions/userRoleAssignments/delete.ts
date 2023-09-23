import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

export const deleteURA = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)

    const id = validateId(req)
    const uraRepo = (await getAppDataSource()).getRepository(UserRoleAssignment)
    const res = await uraRepo.delete({ id })

    context.log(`User #${user.szemely_id} created URA #${id}`)
    return {
      jsonBody: res,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('uras-delete', {
  methods: ['DELETE'],
  route: 'uras/{id}',
  handler: deleteURA,
})
