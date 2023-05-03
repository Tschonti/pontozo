import { Route, Routes } from 'react-router-dom'
import { PLayout } from './components/commons/PLayout'
import { AdminIndex } from './pages/adminIndex/AdminIndex.page'
import { AuthorizedPage } from './pages/authorized/Authorized.page'
import { CategoryCreatePage } from './pages/categories/CategoryCreate.page'
import { CategoryListPage } from './pages/categories/CategoryList.page'
import { CriteriaCreatePage } from './pages/criteria/CriteriaCreate.page'
import { CriteriaListPage } from './pages/criteria/CriteriaList.page'
import { EventDetailsPage } from './pages/events/EventDetails.page'
import { IndexPage } from './pages/events/Index.page'
import { ProfilePage } from './pages/profile/Profile.page'
import { EventRatingPage } from './pages/ratings/EventRating.page'
import { StageRatingPage } from './pages/ratings/StageRatingPage'
import { SeasonCreatePage } from './pages/seasons/SeasonCreate.page'
import { SeasonDetailsPage } from './pages/seasons/SeasonDetails.page'
import { SeasonListPage } from './pages/seasons/SeasonList.page'
import { PATHS } from './util/paths'

export const App = () => {
  return (
    <PLayout>
      <Routes>
        <Route path={PATHS.INDEX}>
          <Route index element={<IndexPage />} />
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
              <Route index element={<SeasonDetailsPage />} />
              <Route path="edit" element={<SeasonCreatePage />} />
            </Route>
            <Route path="new">
              <Route index element={<SeasonCreatePage />} />
            </Route>
            <Route index element={<SeasonListPage />} />
          </Route>
          <Route path={PATHS.EVENTS}>
            <Route path=":eventId">
              <Route index element={<EventDetailsPage />} />
            </Route>
          </Route>
          <Route path={PATHS.RATINGS}>
            <Route path=":ratingId">
              <Route path="stage">
                <Route path=":stageId">
                  <Route index element={<StageRatingPage />} />
                </Route>
              </Route>
              <Route index element={<EventRatingPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </PLayout>
  )
}
