import axios from 'axios'
import { MtfszEvent } from '../types/mtfszEvents'
import { MtfszFetchResult } from '../types/util'
import { eventFilter } from './filters'

const formatDate = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`

export const getRateableEvents = async (apiKey: string, apiManagementHost: string): Promise<MtfszEvent[]> => {
  const url = new URL('esemenyek', apiManagementHost)
  const today = new Date()
  const twoWeeksAgo = new Date(today.getTime() - 35 * 24 * 60 * 60 * 1000) // TODO finalize no of days
  url.searchParams.append('datum_tol', formatDate(twoWeeksAgo))
  url.searchParams.append('datum_ig', formatDate(today))
  url.searchParams.append('exclude_deleted', 'true')
  const res = await axios.get<MtfszFetchResult<MtfszEvent>>(url.toString(), {
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey,
    },
  })

  return res.data.result.filter(eventFilter)
}
