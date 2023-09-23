import { ChakraProvider } from '@chakra-ui/react'
import { ReactPlugin } from '@microsoft/applicationinsights-react-js'
import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './api/contexts/AuthContext'
import { RatingProvider } from './api/contexts/RatingProvider'
import { App } from './App'
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
          <AuthProvider>
            <RatingProvider>
              <App />
            </RatingProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
)
