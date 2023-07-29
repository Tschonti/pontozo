import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

export const deleteSeason = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req)

    const id = validateId(req)
    const seasonRepo = (await getAppDataSource()).getRepository(Season)
    const res = await seasonRepo.delete({ id })
    return {
      jsonBody: res,
    }
  } catch (error) {
    handleException(context, error)
  }
}

app.http('seasons-delete', {
  methods: ['DELETE'],
  route: 'seasons/{id}',
  handler: deleteSeason,
})
