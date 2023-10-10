import fs from 'fs';
import { type ParamsInit } from './types';
import checkEnvVariables from './utils';

if (!fs.existsSync('.env')) {
  throw new Error(
    'Configuration file ".env" not found. Read README for instructions on how to create.'
  );
}

const PARAMS_INIT: ParamsInit = {
//LIMIT: '20',
  SERVER_URL: undefined,
  PORT: 3003,
//DATABASE_HOST: undefined,
//DATABASE_PORT: undefined,
//DATABASE_NAME: undefined,
//DATABASE_USERNAME: undefined,
//DATABASE_PASSWORD: undefined,
//ENCRYPT_KEY: undefined, // 32 символа
};

checkEnvVariables(PARAMS_INIT);

export const {
//LIMIT,
  SERVER_URL,
  PORT,
//DATABASE_HOST,
//DATABASE_PORT,
//DATABASE_NAME,
//DATABASE_USERNAME,
//DATABASE_PASSWORD,
//ENCRYPT_KEY,
} = PARAMS_INIT;
