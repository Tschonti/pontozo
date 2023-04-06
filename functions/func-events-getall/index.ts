import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import axios from 'axios'
import { MTFSZ_CID, MTFSZ_CSECRET } from '../lib/env'

const formatDate = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const fd = new FormData()
  fd.append('grant_type', 'client_credentials')
  const res = await axios.post('https://api.mtfsz.hu/oauth/v2/token', fd, {
    auth: { username: MTFSZ_CID, password: MTFSZ_CSECRET }
  })
  if (res.status !== 200) {
    context.res = {
      status: 401,
      body: 'Failed MTFSZ authentication'
    }
    return
  }
  const eventId = context.bindingData.id as number
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
  context.res = {
    body: events
  }
}
export default httpTrigger
