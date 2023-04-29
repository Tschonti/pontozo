import * as env from 'env-var'

export const DB_SERVER = env.get('DB_SERVER').default('localhost').asString()
export const DB_USER = env.get('DB_USER').default('sa').asString()
export const DB_PWD = env.get('DB_PWD').default('Pr1sm4_Pr1sm4').asString()
export const DB_NAME = env.get('DB_NAME').default('pontozo-db').asString()
export const ENCRYPT = env.get('ENCRYPT').default('false').asBool()
export const APIM_HOST = env.get('APIM_HOST').default('https://pontozo-apim.azure-api.net').asString()
export const APIM_KEY = env.get('APIM_KEY').default('').asString()
export const CLIENT_ID = env.get('CLIENT_ID').default('').asString()
export const CLIENT_SECRET = env.get('CLIENT_SECRET').default('').asString()
export const JWT_SECRET = env.get('JWT_SECRET').default('secretttxd').asString()
export const FUNCTION_HOST = env.get('FUNCTION_HOST').default('http://localhost:3000').asString()
export const FRONTEND_URL = env.get('FRONTEND_URL').default('http://localhost:3001').asString()
