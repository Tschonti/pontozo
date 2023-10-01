import { InvocationContext } from '@azure/functions'
import { createClient } from 'redis'
import { REDIS_HOST, REDIS_PORT, REDIS_PWD } from '../util/env'

export const getRedisClient = async (ctx: InvocationContext) => {
  const client = createClient({
    password: REDIS_PWD,
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
  })

  client.on('error', (err) => ctx.error('Redis Client error', err))

  await client.connect()
  return client
}
