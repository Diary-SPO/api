export interface ParamsInit {
  // LIMIT?: string
  SERVER_URL: string
  PORT: number
  DATABASE_HOST: string
  DATABASE_PORT: number
  DATABASE_NAME: string
  DATABASE_USERNAME: string
  DATABASE_PASSWORD: string
  ENCRYPT_KEY: string // 32 символа
}

export type ParamsKeys = keyof ParamsInit
