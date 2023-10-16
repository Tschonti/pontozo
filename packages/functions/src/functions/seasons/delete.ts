import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

export const deleteSeason = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)

    const id = validateId(req)
    const seasonRepo = (await getAppDataSource(context)).getRepository(Season)
    const res = await seasonRepo.delete({ id })

    context.log(`User #${user.szemely_id} created season #${id}`)
    return {
      jsonBody: res,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('seasons-delete', {
  methods: ['DELETE'],
  route: 'seasons/{id}',
  handler: deleteSeason,
})
