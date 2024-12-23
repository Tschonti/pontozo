import { useToast } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LocalStorageKeys } from 'src/util/localStorageKeys'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { PATHS } from '../../util/paths'

export const AuthorizedPage = () => {
  const { isLoggedIn, onLoginSuccess } = useAuthContext()
  const { search } = useLocation()
  const nav = useNavigate()
  const searchParams = new URLSearchParams(search)
  const token = searchParams.get('token')
  const toast = useToast()

  useEffect(() => {
    if (token && !isLoggedIn) {
      onLoginSuccess(token)
      const redirectRoute = localStorage.getItem(LocalStorageKeys.REDIRECT_ROUTE)
      if (redirectRoute) {
        localStorage.removeItem(LocalStorageKeys.REDIRECT_ROUTE)
        nav(redirectRoute, { replace: true })
      }
    }
    if (isLoggedIn) {
      nav(PATHS.INDEX, { replace: true })
    }
    if (!token) {
      toast({ status: 'error', title: 'Hiba bejelentkezés közben!' })
      nav(PATHS.INDEX, { replace: true })
    }
  }, [isLoggedIn])

  return null
}
