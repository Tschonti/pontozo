import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import axios from 'axios'

const formatDate = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const fd = new FormData()
  fd.append('grant_type', 'client_credentials')
  const res = await axios.post('https://api.mtfsz.hu/oauth/v2/token', fd, {
    auth: { username: '3c6c24dd8c3e67b8138dd0b444a5d666', password: '0e38aa3da4ba01edc8ee2a7a217d2521b450953c97ffd728086d71dc360ae67f' }
  })
  if (res.status !== 200) {
    context.res = {
      status: 401,
      body: 'Failed MTFSZ authentication'
    }
    return
  }
  const url = new URL('esemenyek', 'https://api.mtfsz.hu/api/v1_0/')
  const today = new Date()
  const oneMonthAgo = new Date(today.getTime() - 300 * 24 * 60 * 60 * 1000)
  url.searchParams.append('datum_tol', formatDate(oneMonthAgo))
  url.searchParams.append('datum_ig', formatDate(today))
  url.searchParams.append('exclude_deleted', 'true')
  const events = (await axios.get(url.toString(), { headers: { Authorization: `Bearer ${res.data.access_token}` } })).data
  context.res = {
    body: events
  }
}
export default httpTrigger
