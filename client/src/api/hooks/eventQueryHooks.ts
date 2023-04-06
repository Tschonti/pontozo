import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Cookies from 'js-cookie'
import { CookieKeys } from '../../util/CookieKeys'
import { API_HOST } from '../../util/environment'
import { FetchEventsResult } from '../model/event'

const formatDate = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`

export const useFetchEventsLastMonth = () => {
  return useQuery<FetchEventsResult>(
    ['fetchEvents'],
    async () => {
      const url = new URL('api/events', API_HOST)
      // const today = new Date()
      // const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      // url.searchParams.append('datum_tol', formatDate(oneMonthAgo))
      // url.searchParams.append('datum_ig', formatDate(today))
      // url.searchParams.append('exclude_deleted', 'true')
      const res = await axios.get(url.toString(), {
        headers: {
          Authorization: `Bearer ${Cookies.get(CookieKeys.ACCESS_TOKEN)}`
        }
      })
      return res.data
    },
    { onSuccess: (d) => console.log(d), retry: false }
  )
}
