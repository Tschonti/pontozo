import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import axios from 'axios'
import { MTFSZ_CID, MTFSZ_CSECRET } from '../../util/env'

const formatDate = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`

export const getEvents = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const fd = new FormData()
  fd.append('grant_type', 'client_credentials')
  const res = await axios.post('https://api.mtfsz.hu/oauth/v2/token', fd, {
    auth: { username: MTFSZ_CID, password: MTFSZ_CSECRET }
  })
  if (res.status !== 200) {
    return {
      status: 401,
      body: 'Failed MTFSZ authentication'
    }
  }
  if (req.params.id && isNaN(parseInt(req.params.id))) {
    return {
      status: 400,
      body: 'Érvénytelen esemény azonosító!'
    }
  }
  const eventId = parseInt(req.params.id)
  const url = new URL('esemenyek', 'https://api.mtfsz.hu/api/v1_0/')
  if (eventId) {
    url.searchParams.append('esemeny_id', eventId.toString())
  } else {
    const today = new Date()
    const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    url.searchParams.append('datum_tol', formatDate(oneMonthAgo))
    url.searchParams.append('datum_ig', formatDate(today))
    url.searchParams.append('tipus', 'VERSENY')
    url.searchParams.append('exclude_deleted', 'true')
  }

  const events = (await axios.get(url.toString(), { headers: { Authorization: `Bearer ${res.data.access_token}` } })).data
  return {
    jsonBody: events
  }
}

app.http('events-getall', {
  methods: ['GET'],
  route: 'events/{id?}',
  handler: getEvents
})
