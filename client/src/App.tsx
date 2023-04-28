import { Route, Routes } from 'react-router-dom'
import { PLayout } from './components/commons/PLayout'
import { CategoryCreatePage } from './pages/categories/CategoryCreate.page'
import { CategoryDetailsPage } from './pages/categories/CategoryDetails.page'
import { CategoryListPage } from './pages/categories/CategoryList.page'
import { CriteriaCreatePage } from './pages/criteria/CriteriaCreate.page'
import { CriteriaListPage } from './pages/criteria/CriteriaList.page'
import { CriterionDetailsPage } from './pages/criteria/CriterionDetails.page'
import { EventDetailsPage } from './pages/index/EventDetails.page'
import { IndexPage } from './pages/index/Index.page'
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
          <Route path={PATHS.CRITERIA}>
            <Route path=":criterionId">
              <Route index element={<CriterionDetailsPage />} />
            </Route>
            <Route path="new">
              <Route index element={<CriteriaCreatePage />} />
            </Route>
            <Route index element={<CriteriaListPage />} />
          </Route>
          <Route path={PATHS.CATEGORIES}>
            <Route path=":categoryId">
              <Route index element={<CategoryDetailsPage />} />
            </Route>
            <Route path="new">
              <Route index element={<CategoryCreatePage />} />
            </Route>
            <Route index element={<CategoryListPage />} />
          </Route>
          <Route path={PATHS.SEASONS}>
            <Route path=":seasonId">
              <Route index element={<SeasonDetailsPage />} />
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
