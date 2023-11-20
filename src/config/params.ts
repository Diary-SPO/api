import type { NumericParams, ParamsInit, StringParams } from './types'

const NUMERIC_PARAMS: NumericParams = {
  PORT: 3003,
  DATABASE_PORT: 5432,
}

const STRING_PARAMS: StringParams = {
  SERVER_URL: '',
  DATABASE_HOST: '',
  DATABASE_NAME: '',
  DATABASE_USERNAME: '',
  DATABASE_PASSWORD: '',
  ENCRYPT_KEY: '', // 32 символа
}

const PARAMS_INIT: ParamsInit = { ...NUMERIC_PARAMS, ...STRING_PARAMS }

export default PARAMS_INIT
