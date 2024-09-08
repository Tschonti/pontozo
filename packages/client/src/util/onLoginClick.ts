import { CLIENT_ID, FUNC_HOST, MTFSZ_API_URL } from './environment'

export const onLoginClick = () => {
  window.location.href = `${MTFSZ_API_URL}/oauth/v2/auth?client_id=${CLIENT_ID}&scope=&redirect_uri=${FUNC_HOST}/auth/callback&response_type=code`
}
