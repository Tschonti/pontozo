import axios from 'axios'
import { MtfszEvent } from '../types/mtfszEvents'
import { MtfszFetchResult } from '../types/util'
import { eventFilter } from './filters'

const formatDate = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`

export const getRateableEvents = async (apiKey: string, apiManagementHost: string): Promise<MtfszEvent[]> => {
  const url = new URL('esemenyek', apiManagementHost)
  const today = new Date()
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  url.searchParams.append('datum_tol', formatDate(sevenDaysAgo))
  url.searchParams.append('datum_ig', formatDate(today))
  url.searchParams.append('exclude_deleted', 'true')
  const res = await axios.get<MtfszFetchResult<MtfszEvent>>(url.toString(), {
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey,
    },
  })

  return res.data.result.filter(eventFilter)
}
