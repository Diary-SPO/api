import fs from 'fs'
import { type ParamsInit } from './types'
import checkEnvVariables from './utils'

if (!fs.existsSync('.env')) {
  throw new Error(
    'Configuration file ".env" not found. Read README for instructions on how to create.',
  )
}

const PARAMS_INIT: ParamsInit = {
  SERVER_URL: '',
  PORT: 3003,
  DATABASE_HOST: '',
  DATABASE_PORT: 5432,
  DATABASE_NAME: '',
  DATABASE_USERNAME: '',
  DATABASE_PASSWORD: '',
  ENCRYPT_KEY: '', // 32 символа
}

checkEnvVariables(PARAMS_INIT)

export const {
  SERVER_URL,
  PORT,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  ENCRYPT_KEY,
} = PARAMS_INIT
