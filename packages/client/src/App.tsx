import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ResultTableProvider } from './api/contexts/ResultTableProvider'
import { LoadingSpinner } from './components/commons/LoadingSpinner'
import { PLayout } from './components/commons/PLayout'
import { AuthorizedPage } from './pages/authorized/Authorized.page'
import { ErrorPage } from './pages/error/error.page'
import { EventDetailsPage } from './pages/events/EventDetails.page'
import { IndexPage } from './pages/events/Index.page'
import { LoginPage } from './pages/Login.page'
import { ProfilePage } from './pages/profile/Profile.page'
import { RatingPage } from './pages/ratings/Rating.page'
import { ResultDetailsPage } from './pages/results/ResultDetails.page'
import { ResultsPage } from './pages/results/Results.page'
import { WeightAdjustmentPage } from './pages/seasons/WeightAdjustment.page'
import { PATHS } from './util/paths'

const AdminIndex = lazy(() => import('./pages/adminIndex/AdminIndex.page'))
const CategoryCreatePage = lazy(() => import('./pages/categories/CategoryCreate.page'))
const CategoryListPage = lazy(() => import('./pages/categories/CategoryList.page'))
const CriteriaCreatePage = lazy(() => import('./pages/criteria/CriteriaCreate.page'))
const CriteriaListPage = lazy(() => import('./pages/criteria/CriteriaList.page'))
const SeasonCreatePage = lazy(() => import('./pages/seasons/SeasonCreate.page'))
const SeasonListPage = lazy(() => import('./pages/seasons/SeasonList.page'))
const UraCreatePage = lazy(() => import('./pages/uras/UraCreate.page'))
const UraListPage = lazy(() => import('./pages/uras/UraList.page'))

export const App = () => {
  return (
    <PLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path={PATHS.INDEX}>
            <Route index element={<IndexPage />} />
            <Route path={PATHS.ERROR} element={<ErrorPage />} />
            <Route path={PATHS.LOGIN} element={<LoginPage />} />
            <Route path={PATHS.ADMIN} element={<AdminIndex />} />
            <Route path={PATHS.AUTHORIZED} element={<AuthorizedPage />} />
            <Route path={PATHS.PROFILE} element={<ProfilePage />} />
            <Route path={PATHS.CRITERIA}>
              <Route path=":criterionId">
                <Route path="edit" element={<CriteriaCreatePage />} />
              </Route>
              <Route path="new">
                <Route index element={<CriteriaCreatePage />} />
              </Route>
              <Route index element={<CriteriaListPage />} />
            </Route>
            <Route path={PATHS.CATEGORIES}>
              <Route path=":categoryId">
                <Route path="edit" element={<CategoryCreatePage />} />
              </Route>
              <Route path="new">
                <Route index element={<CategoryCreatePage />} />
              </Route>
              <Route index element={<CategoryListPage />} />
            </Route>
            <Route path={PATHS.SEASONS}>
              <Route path=":seasonId">
                <Route path="edit" element={<SeasonCreatePage />} />
                <Route path="weights" element={<WeightAdjustmentPage />} />
              </Route>
              <Route path="new">
                <Route index element={<SeasonCreatePage />} />
              </Route>
              <Route index element={<SeasonListPage />} />
            </Route>
            <Route path={PATHS.USERS}>
              <Route path=":uraId">
                <Route path="edit" element={<UraCreatePage />} />
              </Route>
              <Route path="new">
                <Route index element={<UraCreatePage />} />
              </Route>
              <Route index element={<UraListPage />} />
            </Route>
            <Route path={PATHS.EVENTS}>
              <Route path=":eventId">
                <Route index element={<EventDetailsPage />} />
              </Route>
            </Route>
            <Route path={PATHS.RATINGS}>
              <Route path=":ratingId" element={<RatingPage />} />
            </Route>
            <Route path={PATHS.RESULTS}>
              <Route
                index
                element={
                  <ResultTableProvider>
                    <ResultsPage />
                  </ResultTableProvider>
                }
              />

              <Route path=":eventId">
                <Route
                  index
                  element={
                    <ResultTableProvider minimal>
                      <ResultDetailsPage />
                    </ResultTableProvider>
                  }
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </PLayout>
  )
}
