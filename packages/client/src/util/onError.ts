import { ToastId, UseToastOptions } from '@chakra-ui/react'
import { NavigateFunction } from 'react-router-dom'
import { PontozoError } from '../../../common/src'

export const onError = (e: PontozoError, toast: (options?: UseToastOptions) => ToastId, nav?: NavigateFunction, navTarget?: string) => {
  toast({ title: e.message, status: 'error' })
  if (nav && navTarget) {
    nav(navTarget)
  }
}
