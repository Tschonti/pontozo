import { DbUser, UserRole } from '@pontozo/common'
import Cookies from 'js-cookie'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CookieKeys } from '../../util/CookieKeys'
import { PATHS } from '../../util/paths'
import { queryClient } from '../../util/queryClient'
import { useUserDataQuery, useValidateUserRolesMutation } from '../hooks/authHooks'

export type AuthContextType = {
  isLoggedIn: boolean
  loggedInUser: DbUser | undefined
  isAdmin: boolean
  loggedInUserLoading: boolean
  loggedInUserError: unknown
  onLoginSuccess: (jwt: string) => void
  onLogout: (path?: string) => void
  refetchUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isAdmin: false,
  loggedInUser: undefined,
  loggedInUserLoading: false,
  loggedInUserError: undefined,
  onLoginSuccess: () => {},
  onLogout: () => {},
  refetchUser: async () => {},
})

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(typeof Cookies.get(CookieKeys.JWT_TOKEN) !== 'undefined')

  const { isLoading, data: user, error } = useUserDataQuery(isLoggedIn)
  const { mutate: verifyUserRoles } = useValidateUserRolesMutation()

  useEffect(() => {
    verifyUserRoles(undefined, {
      onSuccess: (res) => {
        Cookies.set(CookieKeys.JWT_TOKEN, res.token, { expires: 2 })
      },
    })
  }, [verifyUserRoles])

  const onLoginSuccess = (jwt: string) => {
    Cookies.set(CookieKeys.JWT_TOKEN, jwt, { expires: 2 })
    setIsLoggedIn(true)
    queryClient.invalidateQueries({ queryKey: ['currentUser'] })
  }

  const onLogout = (path: string = PATHS.INDEX) => {
    Cookies.remove(CookieKeys.JWT_TOKEN)
    setIsLoggedIn(false)
    queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    navigate(path, { replace: true })
  }

  const refetchUser = async () => {
    return queryClient.invalidateQueries({ queryKey: ['currentUser'] })
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAdmin: isLoggedIn && !!user?.roles.includes(UserRole.SITE_ADMIN),
        loggedInUserLoading: isLoading,
        loggedInUser: user,
        loggedInUserError: error,
        onLoginSuccess,
        onLogout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
