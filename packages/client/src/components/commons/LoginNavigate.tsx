import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { LocalStorageKeys } from 'src/util/localStorageKeys'
import { PATHS } from 'src/util/paths'

export const LoginNavigate = () => {
  const { pathname, search } = useLocation()

  useEffect(() => {
    console.log(pathname + search)
    localStorage.setItem(LocalStorageKeys.REDIRECT_ROUTE, pathname + search)
  }, [pathname, search])

  return <Navigate to={PATHS.LOGIN} />
}
