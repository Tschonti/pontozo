import { CLIENT_ID, FUNC_HOST } from './environment'

export const onLoginClick = () => {
  window.location.href = `https://api.mtfsz.hu/oauth/v2/auth?client_id=${CLIENT_ID}&scope=&redirect_uri=${FUNC_HOST}/auth/callback&response_type=code`
}
