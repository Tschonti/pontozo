import { ChakraProvider } from '@chakra-ui/react'
import { AppInsightsErrorBoundary, ReactPlugin } from '@microsoft/applicationinsights-react-js'
import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './api/contexts/AuthContext'
import { CacheProvider } from './api/contexts/CacheContext'
import { RatingProvider } from './api/contexts/RatingProvider'
import { App } from './App'
import { ErrorPage } from './pages/error/error.page'
import { APP_INSIGHTS_CONN_STR } from './util/environment'
import { queryClient } from './util/queryClient'
import theme from './util/theme'

const reactPlugin = new ReactPlugin()
const appInsights = new ApplicationInsights({
  config: {
    connectionString: APP_INSIGHTS_CONN_STR,
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
  },
})
appInsights.loadAppInsights()

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppInsightsErrorBoundary onError={() => <ErrorPage />} appInsights={reactPlugin}>
            <CacheProvider>
              <AuthProvider>
                <RatingProvider>
                  <App />
                </RatingProvider>
              </AuthProvider>
            </CacheProvider>
          </AppInsightsErrorBoundary>
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
)
