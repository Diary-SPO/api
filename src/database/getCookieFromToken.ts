import { ENCRYPT_KEY } from '@config'
import { client } from '@db'
import createQueryBuilder, { decrypt } from '@diary-spo/sql'
import { CookieGetDetailedInfo } from '@types'
import { formatDate } from '@utils'
import { protectInjection } from 'src/utils/protectInjection'

interface CacheTokensCookie {
  [key: string]: {
    cookie: string
    lastDate: string
    addedSeconds: number // количество секунд с добавления
  }
}

const cacheTokensCookie: CacheTokensCookie = {}
let nearestExpiringToken = null // Ближайшая старая запись в кеше. Бередём ядро, не занимаем ненужными операциями :)
const maxTokenLifeTimeCache = 60 * 5 // 5 минут
const maxElementsFromCache = 1000 // Максимум токенов, хранящихся в памяти

/**
 * Возвращает куку при предъявлении токена
 * @param token
 * @returns {string} cookie
 */
const getCookieFromToken = async (token: string) => {
  if (token.length < 16) {
    throw new Error('The token cannot be shorter than 16 characters')
  }

  const cacheCookieGet = cacheGetter(token)

  if (cacheCookieGet) {
    // @ts-ignore
    updaterDateFromToken(token) // Обновляем дату последнего использования куки, если нужно
    return cacheCookieGet
  }

  const getCookieQueryBuilder = await createQueryBuilder<CookieGetDetailedInfo>(
    client,
  )
    .select(
      'auth.id',
      '"idDiaryUser"',
      'token',
      '"lastDate"',
      '"lastUsedDate"',
      'cookie',
    )
    .from('auth" INNER JOIN "diaryUser" ON "diaryUser".id = auth."idDiaryUser')
    .where(`auth.token = '${protectInjection(token)}'`)
    .first()

  if (!getCookieQueryBuilder) {
    throw new Error('Token not finded!')
  }

  getCookieQueryBuilder.cookie = decrypt(
    getCookieQueryBuilder.cookie,
    ENCRYPT_KEY,
  )

  // @ts-ignore
  taskScheduler(getCookieQueryBuilder) // Запускает обслуживание кеширования токенов + сохраняет текущий токен в кэше
  // @ts-ignore
  updaterDateFromToken(token) // Обновляем дату последнего использования куки, если нужно

  return getCookieQueryBuilder.cookie
}

/**
 * Кеширует куку по токену и очищает кеш, если он слишком большой
 * @param saveData
 * @returns {void}
 */
const taskScheduler = async (
  saveData: CookieGetDetailedInfo,
): Promise<void> => {
  // Добавляем/обновляем информацию в кэше
  const expiring = new Date().getTime() / 1000
  cacheTokensCookie[saveData.token] = {
    cookie: saveData.cookie,
    lastDate: saveData.lastDate,
    addedSeconds: expiring,
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

const updaterDateFromToken = async (token: CookieGetDetailedInfo | string) => {
  // Предворительно обновляем дату использования, если нужно
  const currDateFormated = formatDate(new Date().toISOString())
  const saveData =
    typeof token !== 'string'
      ? token
      : (cacheTokensCookie?.[token] as unknown as CookieGetDetailedInfo)
  if (formatDate(String(saveData.lastDate)) != currDateFormated) {
    const updateLastDateFromTokenQueryBuilder = await createQueryBuilder(client)
      .from('auth')
      .where(`token = '${token}'`)
      .update({
        lastDate: currDateFormated,
      })
    // Если смогли обновить, то сохраняем новую дату
    if (updateLastDateFromTokenQueryBuilder) {
      saveData.lastDate = currDateFormated
    }
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
  if (cacheCookie) {
    return cacheCookie.cookie
  }
  return null
}

export { getCookieFromToken }
