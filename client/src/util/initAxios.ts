import axios from 'axios'
import { API_HOST } from './environment'

export const initAxios = () => {
  axios.defaults.baseURL = API_HOST
  /*axios.interceptors.request.use((config) => {
      const token = Cookies.get(CookieKeys.)
      if (token && config.headers) {
        ;(config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`)
      }

      return config
    })*/
}
