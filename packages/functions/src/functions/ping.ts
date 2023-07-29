import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import Criterion from '../typeorm/entities/Criterion'
import { getAppDataSource } from '../typeorm/getConfig'
import { handleException } from '../util/handleException'

export const ping = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    await (await getAppDataSource()).getRepository(Criterion).findOne({ where: { id: 1 } })
    return {
      body: 'Ready',
    }
  } catch (error) {
    handleException(context, error)
  }
}

app.http('ping', {
  methods: ['GET'],
  route: 'ping',
  handler: ping,
})
