/**
 * Утилитарный тип, который делает каждое свойство объекта T либо строкой, либо числом.
 */

export type StringOrNumber<T> = {
  [K in keyof T]: string | number
}

export interface ParamsInit {
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


