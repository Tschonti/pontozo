import { Route, Routes } from 'react-router-dom'
import { PLayout } from './components/commons/PLayout'
import { IndexPage } from './pages/index/Index.page'
import { PATHS } from './util/paths'

export const App = () => {
  return (
    <PLayout>
      <Routes>
        <Route path={PATHS.INDEX}>
          <Route index element={<IndexPage />} />
        </Route>
      </Routes>
    </PLayout>
  )
}
