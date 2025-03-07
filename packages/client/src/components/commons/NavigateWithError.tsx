import { useToast } from '@chakra-ui/react'
import { PontozoError } from '@pontozo/common'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

type Props = {
  error: PontozoError
  to: string
}

export const NavigateWithError = ({ error, to }: Props) => {
  const toast = useToast()

  useEffect(() => {
    toast({ title: error.message, status: 'error' })
  }, [toast, error])

  return <Navigate replace to={to} />
}
