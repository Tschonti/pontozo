import * as env from 'env-var'

export const FUNC_HOST = env.get('REACT_APP_FUNC_HOST').default('http://localhost:7071/api').asString()
export const APIM_HOST = env.get('REACT_APP_APIM_HOST').default('https://pontozo-apim.azure-api.net').asString()
export const APIM_KEY = env.get('REACT_APP_APIM_KEY').required().asString()
