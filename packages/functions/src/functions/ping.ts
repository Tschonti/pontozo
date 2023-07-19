import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import Criterion from '../typeorm/entities/Criterion'
import { getAppDataSource } from '../typeorm/getConfig'

export const ping = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  await (await getAppDataSource()).getRepository(Criterion).findOne({ where: { id: 1 } })
  return {
    body: 'Ready'
  }
}

app.http('ping', {
  methods: ['GET'],
  route: 'ping',
  handler: ping
})
