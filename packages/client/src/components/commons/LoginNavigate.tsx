import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { LocalStorageKeys } from 'src/util/localStorageKeys'
import { PATHS } from 'src/util/paths'

export const LoginNavigate = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    localStorage.setItem(LocalStorageKeys.REDIRECT_ROUTE, pathname)
  }, [pathname])

  return <Navigate to={PATHS.LOGIN} />
}
