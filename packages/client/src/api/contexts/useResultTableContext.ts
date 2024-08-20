import { useContext } from 'react'
import { ResultTableContext, ResultTableContextType } from './ResultTableContext'

export const useResultTableContext = () => {
  return useContext<ResultTableContextType>(ResultTableContext)
}
