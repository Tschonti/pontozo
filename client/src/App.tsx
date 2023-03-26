import { QueryClient } from '@tanstack/react-query'
import { Route, Routes } from 'react-router-dom'
import { PLayout } from './components/commons/PLayout'
import { CriteriaListPage } from './pages/criteria/CriteriaList.page'
import { CriterionDetailsPage } from './pages/criteria/CriterionDetails.page'
import { IndexPage } from './pages/index/Index.page'
import { PATHS } from './util/paths'

export const App = () => {
  return (
    <PLayout>
      <Routes>
        <Route path={PATHS.INDEX}>
          <Route index element={<IndexPage />} />
          <Route path={PATHS.CRITERIA}>
            <Route path=":criterionId">
              <Route index element={<CriterionDetailsPage />} />
            </Route>
            <Route index element={<CriteriaListPage />} />
          </Route>
        </Route>
      </Routes>
    </PLayout>
  )
}
