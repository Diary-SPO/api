import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USERNAME
} from '@config'
import { error } from '@utils'
import { Client } from 'pg'
import { exit } from 'process'

export const client = new Client({
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  database: DATABASE_NAME,
  user: DATABASE_USERNAME,
  password: DATABASE_PASSWORD
})

client.connect((err) => {
  if (err) {
    error('Ошибка подключения к Базе Данных: ', err)
    exit()
  }
})

export * from './authService'
