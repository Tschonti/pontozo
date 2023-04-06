import * as env from 'env-var'

export const DB_SERVER = env.get('DB_SERVER').default('localhost').asString()
export const DB_USER = env.get('DB_USER').default('sa').asString()
export const DB_PWD = env.get('DB_PWD').default('Pr1sm4_Pr1sm4').asString()
export const DB_NAME = env.get('DB_NAME').default('pontozo-db').asString()
export const ENCRYPT = env.get('ENCRYPT').default('false').asBool()
export const MTFSZ_CID = env.get('MTFSZ_CID').required().asString()
export const MTFSZ_CSECRET = env.get('MTFSZ_CSECRET').required().asString()
