import { useToast } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
    }
  }, [])

  if (isLoggedIn) {
    nav(PATHS.INDEX, { replace: true })
  }

  if (!token) {
    toast({ status: 'error', title: 'Hiba bejelentkezés közben!' })
  }
  nav(PATHS.INDEX, { replace: true })
  return null
}
