import { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD } from '@config'
import { sleep } from 'bun'
import { Client } from 'pg'
import { exit } from 'process'

const client = new Client({
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  database: DATABASE_NAME,
  user: DATABASE_USERNAME,
  password: DATABASE_PASSWORD
})

// Удерживаем в ожидании подключения
let status = null

await client.connect(err => {
    if (err) {
        console.log(`Ошибка подключения к Базе Данных:\r\n${err}`)
        exit()
    }
    // Если ок, то пускаем дальше
    status = true
})

while (status === null) await sleep(25)

export { client }