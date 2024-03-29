import axios, { AxiosHeaders } from 'axios'
import Cookies from 'js-cookie'
import { CookieKeys } from './CookieKeys'
import { APIM_HOST, APIM_KEY, FUNC_HOST } from './environment'

export const functionAxios = axios.create({
  baseURL: FUNC_HOST,
})
functionAxios.interceptors.request.use((config) => {
  const token = Cookies.get(CookieKeys.JWT_TOKEN)
  if (token && config.headers) {
    ;(config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`)
  }

  return config
})

functionAxios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error?.response?.data) {
      return Promise.reject(error.response.data)
    }
    return Promise.reject(error)
  }
)

export const apimAxios = axios.create({
  baseURL: APIM_HOST,
  headers: {
    'Ocp-Apim-Subscription-Key': APIM_KEY,
  },
})
