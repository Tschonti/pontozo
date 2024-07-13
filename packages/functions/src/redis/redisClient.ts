import { InvocationContext } from '@azure/functions'
import { createClient } from 'redis'
import { ENV, REDIS_HOST, REDIS_PORT, REDIS_PWD } from '../util/env'

export const getRedisClient = async (ctx: InvocationContext) => {
  const client = createClient({
    password: ENV === 'production' ? REDIS_PWD : undefined,
    socket: {
      tls: ENV === 'production',
      host: REDIS_HOST,
      port: REDIS_PORT,
      connectTimeout: 10000,
    },
  })

  client.on('error', (err) => ctx.error('Redis Client error', err))

  await client.connect()
  return client
}
