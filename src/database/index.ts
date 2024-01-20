import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USERNAME
} from '@config'
import {exit} from 'process'
import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize({
  database: DATABASE_NAME,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  dialect: 'postgres'
})

try {
  await sequelize.authenticate()
  console.log('Database: Connection succefully!')
} catch (error) {
  console.error('Unable to connect to the database:', error)
  exit()
}

// !!! TODO: Сделать миграции !!!