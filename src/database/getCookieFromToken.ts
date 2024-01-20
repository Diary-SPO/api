import { ENCRYPT_KEY } from '@config'
import { client } from '@db'
import createQueryBuilder, { decrypt } from '@diary-spo/sql'
import { CookieInfoFromDatabase } from '@diary-spo/types'
import { error, formatDate } from '@utils'
import { protectInjection } from 'src/utils/protectInjection'

type TokenType = {
  cookie: string
  lastUsedDate: string
  addedSeconds: number // количество секунд с добавления
}

type CacheTokensCookie = Record<string, TokenType>

const cacheTokensCookie: CacheTokensCookie = {}
let nearestExpiringToken = null // Ближайшая старая запись в кеше. Бережём ядро, не занимаем ненужными операциями
const maxTokenLifeTimeCache = 60 * 5 // 5 минут
const maxElementsFromCache = 1000 // Максимум токенов, хранящихся в памяти

class ApiError extends Error {
  code: number

  constructor(message: string, code: number) {
    super(message)
    this.code = code
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

/**
 * Возвращает куку при предъявлении токена
 * @param token
 * @returns {string} cookie
 */
const getCookieFromToken = async (token: string): Promise<string> => {
  const getCacheFromCookie = cacheGetter(token)

  if (getCacheFromCookie) {
    updaterDateFromToken(token) // Обновляем дату последнего использования куки, если нужно
      .catch((err) => {
        console.log(err.toString())
      })

    return getCacheFromCookie
  }

  const getCookieQueryBuilder =
    await createQueryBuilder<CookieInfoFromDatabase>(client)
      .select('auth.id', '"idDiaryUser"', 'token', '"lastUsedDate"', 'cookie')
      .from(
        'auth" INNER JOIN "diaryUser" ON "diaryUser".id = auth."idDiaryUser'
      )
      .where(`auth.token = '${protectInjection(token)}'`)
      .first()

  if (!getCookieQueryBuilder) {
    throw new ApiError('Token not found!', 401)
  }

  getCookieQueryBuilder.cookie = decrypt(
    getCookieQueryBuilder.cookie,
    ENCRYPT_KEY
  )

  taskScheduler(getCookieQueryBuilder) // Запускает обслуживание кеширования токенов + сохраняет текущий токен в кэше
    .catch((err) => {
      console.log(err.toString())
    })

  updaterDateFromToken(token) // Обновляем дату последнего использования куки, если нужно
    .catch((err) => {
      console.log(err.toString())
    })

  return getCookieQueryBuilder.cookie
}

/**
 * Кеширует куку по токену и очищает кеш, если он слишком большой
 * @param saveData
 * @returns {void}
 */
const taskScheduler = async (
  saveData: CookieInfoFromDatabase
): Promise<void> => {
  // Добавляем/обновляем информацию в кэше
  const expiring = new Date().getTime() / 1000
  cacheTokensCookie[saveData.token] = {
    cookie: saveData.cookie,
    lastUsedDate: saveData.lastUsedDate,
    addedSeconds: expiring
  }

  if (!expiring) {
    nearestExpiringToken = expiring + maxTokenLifeTimeCache
  }

  // Если кеш разросся слишком сильно, то нужно обработать
  const actualLengthCache = Object.keys(cacheTokensCookie).length // Сохраняем, чтобы не пересчитывать
  if (actualLengthCache > maxElementsFromCache) {
    const actualSeconds = new Date().getTime() / 1000
    if (expiring >= actualSeconds) {
      return
    }

    let newNearestExpiringToken = Number.MAX_VALUE
    Object.keys(cacheTokensCookie).forEach((token) => {
      const currAddedSeconds = cacheTokensCookie[token].addedSeconds
      if (currAddedSeconds < actualSeconds) {
        delete cacheTokensCookie[token]
        return
      }

      if (
        currAddedSeconds < newNearestExpiringToken ||
        !newNearestExpiringToken
      ) {
        newNearestExpiringToken = currAddedSeconds
      }
    })

    nearestExpiringToken = newNearestExpiringToken
  }
}

const updaterDateFromToken = async (
  token: CookieInfoFromDatabase | string
): Promise<void> => {
  // Предварительно обновляем дату использования, если нужно
  const currDateFormatted = formatDate(new Date().toISOString())
  const saveData = typeof token !== 'string' ? token : cacheTokensCookie[token]

  if (formatDate(saveData.lastUsedDate) === currDateFormatted) {
    return
  }

  // Обновляем в базе последнее время активности токена, если оно отличается от "сегодня"
  const updateLastDateFromTokenQueryBuilder = await createQueryBuilder(client)
    .from('auth')
    .where(`token = '${token}'`)
    .update({ lastUsedDate: currDateFormatted })

  // Если смогли обновить, то сохраняем новую дату
  if (updateLastDateFromTokenQueryBuilder) {
    saveData.lastUsedDate = currDateFormatted
  }
}

/**
 * Возвращает куку, если она закеширована, или null, если она отсутствует
 * @param token
 * @returns {string} cookie
 * @returns {null}
 */
const cacheGetter = (token: string): string | null => {
  const cacheCookie = cacheTokensCookie?.[token]

  if (!cacheCookie) {
    return null
  }

  return cacheCookie.cookie
}

export { getCookieFromToken }
