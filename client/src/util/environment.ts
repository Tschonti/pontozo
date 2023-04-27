import * as env from 'env-var'

export const FUNC_HOST = env.get('REACT_APP_FUNC_HOST').default('http://localhost:3000').asString()
export const APIM_HOST = env.get('REACT_APP_APIM_HOST').default('https://pontozo-apim.azure-api.net').asString()
export const APIM_KEY = env.get('REACT_APP_APIM_KEY').required().asString()
export const CLIENT_ID = env.get('REACT_APP_CLIENT_ID').default('').asString()
export const CLIENT_SECRET = env.get('REACT_APP_CLIENT_SECRET').default('').asString()
