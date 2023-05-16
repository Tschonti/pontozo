import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { HttpResponseInit } from '@azure/functions/types/http'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'

export const getURAs = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const adminCheck = getUserFromHeaderAndAssertAdmin(req)
  if (adminCheck.isError) {
    return httpResFromServiceRes(adminCheck)
  }

  try {
    const urasRepo = (await getAppDataSource()).getRepository(UserRoleAssignment)
    const uras = await urasRepo.find()

    return {
      jsonBody: uras
    }
  } catch (error) {
    context.log(error)
    return {
      status: 500,
      body: error
    }
  }
}

app.http('uras-getAll', {
  methods: ['GET'],
  route: 'uras',
  handler: getURAs
})
