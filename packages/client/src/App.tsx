import { Route, Routes } from 'react-router-dom'
import { PLayout } from './components/commons/PLayout'
import { AdminIndex } from './pages/adminIndex/AdminIndex.page'
import { AuthorizedPage } from './pages/authorized/Authorized.page'
import { CategoryCreatePage } from './pages/categories/CategoryCreate.page'
import { CategoryListPage } from './pages/categories/CategoryList.page'
import { CriteriaCreatePage } from './pages/criteria/CriteriaCreate.page'
import { CriteriaListPage } from './pages/criteria/CriteriaList.page'
import { ErrorPage } from './pages/error/error.page'
import { EventDetailsPage } from './pages/events/EventDetails.page'
import { IndexPage } from './pages/events/Index.page'
import { ProfilePage } from './pages/profile/Profile.page'
import { RatingPage } from './pages/ratings/Rating.page'
import { ResultsPage } from './pages/results/Results.page'
import { SeasonCreatePage } from './pages/seasons/SeasonCreate.page'
import { SeasonListPage } from './pages/seasons/SeasonList.page'
import { UraCreatePage } from './pages/uras/UraCreate.page'
import { UraListPage } from './pages/uras/UraList.page'
import { PATHS } from './util/paths'

export const App = () => {
  return (
    <PLayout>
      <Routes>
        <Route path={PATHS.INDEX}>
          <Route index element={<IndexPage />} />
          <Route path={PATHS.ERROR} element={<ErrorPage />} />
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
            <Route index element={<ResultsPage />} />
            {/* TODO <Route path=":eventId">
              <Route index element={<EventDetailsPage />} />
            </Route> */}
          </Route>
        </Route>
      </Routes>
    </PLayout>
  )
}
