import { ParamsInit, StringOrNumber } from './types'

const PARAMS_INIT: StringOrNumber<ParamsInit> = {
  SERVER_URL: '',
  PORT: 3003,
  DATABASE_HOST: '',
  DATABASE_PORT: 5432,
  DATABASE_NAME: '',
  DATABASE_USERNAME: '',
  DATABASE_PASSWORD: '',
  ENCRYPT_KEY: '', // 32 символа
}

export default PARAMS_INIT
