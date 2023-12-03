import { sleep } from 'bun'
import createQueryBuilder, { decrypt, encrypt, fetcher } from '@diary-spo/sql'
import { client } from '@db'
import { UserData } from '@diary-spo/shared'
import { ENCRYPT_KEY, SERVER_URL } from '@config'
import { cookieExtractor } from './utils/cookieExtractor'
import { DiaryUser, CookieGetDetailedInfo } from '@diary-spo/types'

// Время последнего запуска обслуживания кук
let lastSchedulerRunning: Date | null = null
// Конфиг
const intervalRun = 60 * 60 // Запускать каждый час <--- Это можно менять
const maxLifeTimeInactiveTokenDays = 7 // В днях <--- Это можно менять
const maxNotUpdateTokenInDays = 5 // Через сколько дней обновлять токен ? <--- Это можно менять
const delayRequestInSeconds = 500 // пауза в миллисекундах между обращениями к оригинальному дневнику (а то заблокируют вдруг, да и не нужно спам запросами устраивать)
// Вычисляется автоматом
const maxLifeTimeInactiveTokenSeconds = maxLifeTimeInactiveTokenDays * 24 * 60 * 60 // В секундах
const maxNotUpdateTokenInSeconds = maxNotUpdateTokenInDays * 24 * 60 * 60 // Через сколько дней обновлять токен в секундах

const messageNext = () => {
  console.log(
    `WORKER: Обновление кук завершено (${new Date()})! Следующее обновление через ` +
      (lastSchedulerRunning?.getTime() / 1000 +
        intervalRun -
        new Date().getTime() / 1000) +
      ' секунд',
  )
}

// TODO: Стоит ли сделать постраничное извлечение, чтобы не загружать в память сразу все 100500 записей ?
while (true) {
  if (lastSchedulerRunning) {
    if (
      lastSchedulerRunning.getTime() / 1000 + intervalRun >=
      new Date().getTime() / 1000
    ) {
      await sleep(intervalRun)
      continue
    }
  }

  console.log(`WORKER: Начался проход и обновление кук... (${new Date()})`)

  // Обрабатываем и проверяем, нужно ли перевыпустить куки
  // ---------------------------------------------------->

  // 1. Получаем токены из базы
  const tokenExtractorQueryBuilder =
    await createQueryBuilder<CookieGetDetailedInfo>(client).customQueryRun(
      `SELECT * FROM auth`,
    )

  if (!tokenExtractorQueryBuilder) {
    console.error(
      'WORKER: Ошибка извлечения токенов. Возможно их там просто нет ?',
    )
    lastSchedulerRunning = new Date()
    continue
  }

  // 2. Если успешно, то удаляем просроченные
  for (let i = 0; i < tokenExtractorQueryBuilder.length; i++) {
    const currTokenInfo = tokenExtractorQueryBuilder[i]
    // Если давно уже неактивен (см. параметр maxLifeTimeInactiveTokenDays)
    if (
      new Date(currTokenInfo.lastDate).getTime() / 1000 -
        new Date().getTime() / 1000 >
      maxLifeTimeInactiveTokenSeconds
    ) {
      await createQueryBuilder(client)
        .from('auth')
        .where(`id = ${currTokenInfo.id}`)
        .delete()
      tokenExtractorQueryBuilder.splice(i, 1) // Удаляем из памяти, больше не обрабатываем
    }
  }

  // 3. Сортируем, оставляя только токены от уникальных пользователей, к тому же тех, у кого кука истекает
  const ids: number[] = []
  for (let i = 0; i < tokenExtractorQueryBuilder.length; i++) {
    const tokenData = tokenExtractorQueryBuilder[i]
    // Если не повторяется в списке и токен истекает (см. maxNotUpdateTokenInDays)
    if (
      ids.indexOf(tokenData.idDiaryUser) == -1 &&
      new Date(tokenData.lastUsedDate).getTime() / 1000 +
        maxNotUpdateTokenInSeconds <
        new Date().getTime() / 1000
    ) {
      ids.push(tokenData.idDiaryUser)
    }
  }

  // 4. Выгружаем из памяти оставшийся список токенов
  if (tokenExtractorQueryBuilder.length > 0)
    tokenExtractorQueryBuilder.splice(0, tokenExtractorQueryBuilder.length)

  if (ids.length == 0) {
    console.log('WORKER: некого обновлять. Завершаю проход')
    lastSchedulerRunning = new Date()
    messageNext()
    continue
  }

  // 5. Загружаем пользователей, чьи куки нужно обновить
  const getDiaryUserQueryBuilder = await createQueryBuilder<DiaryUser>(
    client,
  ).customQueryRun(
    `SELECT id, login, password, cookie FROM "diaryUser" WHERE id IN (${ids.join(
      ', ',
    )})`,
  )

  if (!getDiaryUserQueryBuilder) {
    console.error(
      'WORKER: Ошибка извлечения пользователей! Возможно нет кук для обновления ?',
    )
    lastSchedulerRunning = new Date()
    messageNext()
    continue
  }

  // 6. Обновляем для каждого куку и записываем
  for (let i = 0; i < getDiaryUserQueryBuilder.length; i++) {
    const userForUpdate = getDiaryUserQueryBuilder[i]
    const login = userForUpdate.login
    const password = decrypt(userForUpdate.password, ENCRYPT_KEY)
    await sleep(delayRequestInSeconds) // Задержка между запросами к оригинальному дневнику

    // ТУТ ОБНОВИТЬ И СОХРАНИТЬ
    const res = await fetcher<UserData>({
      url: `${SERVER_URL}/services/security/login`,
      method: 'POST',
      body: JSON.stringify({ login, password, isRemember: true }),
    })
    // Если дневник вернул что-то другое...
    if (typeof res === 'number') {
      console.error(
        'WORKER: Что-то не так... Дневник ответил чем-то другим ? Для отладки: ' +
          res,
      )
      continue
    }

    // Подготавливаем куку
    const setCookieHeader = res.headers.get('Set-Cookie')
    const cookie = cookieExtractor(setCookieHeader ?? '')
    const encryptCookie = encrypt(String(cookie), ENCRYPT_KEY)

    // Обновляем куку
    await createQueryBuilder(client)
      .from('diaryUser')
      .where(`id = ${userForUpdate.id}`)
      .update({
        cookie: encryptCookie,
      })
    // Форматируем дату
    const date = new Date()
    const formattedDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`
    // Обновляем дату последнего обновления в токенах пользователя
    await createQueryBuilder(
      client,
    )
      .from('auth')
      .where(`"idDiaryUser" = ${userForUpdate.id}`)
      .update({
        lastUsedDate: formattedDate,
      })
  }

  // 7. Устанавливаем время завершения обновления
  lastSchedulerRunning = new Date()

  // ну и отпускаем в следующий цикл...
  messageNext()
}
