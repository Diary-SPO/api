import { ENCRYPT_KEY, SERVER_URL } from '@config'
import { client } from '@db'
import { type UserData } from '@diary-spo/shared'
import createQueryBuilder, { encrypt, fetcher } from '@diary-spo/sql'
import type {
  Group,
  PersonResponse,
  ResponseLogin,
  SPO
} from '@diary-spo/types'
import { ResponseLoginFromDiaryUser } from '@types'
import { formatDate } from '@utils'
import { cookieExtractor } from 'src/utils/cookieExtractor'
import {
  type DatabaseDiaryUser,
  type DatabaseResponseLogin
} from '../types/diaryTypes/types'
import { offlineAuth } from './auth'
import { generateToken } from './generateToken'

/**
 * Регистрирует/авторизирует в оригинальном дневнике с сохранением данных в базе данных.
 * Может сохранять и обновлять данные о пользователе/группе/образовательной организации в случае успешной авторизации
 * @param login
 * @param password
 * @returns {ResponseLogin}
 */
export const registration = async (
  login: string,
  password: string
): Promise<DatabaseResponseLogin | ResponseLogin | null> => {
  const res = await fetcher<UserData>({
    url: `${SERVER_URL}/services/security/login`,
    method: 'POST',
    body: JSON.stringify({ login, password, isRemember: true })
  })

  if (res > 401) {
    const authData = await offlineAuth(login, password).catch((err) => {
      throw new Error(
        `Authorization error: access to the diary was denied, and authorization through the database failed. Full: ${err}`
      )
    })

    // Краткую запись исправляет eslint, так что я не виноват...
    if (authData) return authData ?? null
  }
  if (typeof res === 'number') throw new Error('Invalid username or password')

  try {
    const tenant = res.data.tenants[res.data.tenantName]
    const student = tenant.studentRole.students[0]
    const SPO = tenant.settings.organization

    const setCookieHeader = res.headers.get('Set-Cookie')
    const cookie = cookieExtractor(setCookieHeader ?? '')

    const detailedInfo = await fetcher<PersonResponse>({
      url: `${SERVER_URL}/services/security/account-settings`,
      cookie
    })

    if (typeof detailedInfo === 'number') {
      throw new Error('Error get detailed info!')
    }

    // TODO: add ENCRYPT_KEY
    const regData: DatabaseDiaryUser = {
      id: student.id,
      groupId: student.groupId,
      login,
      password: encrypt(password ?? '', ENCRYPT_KEY),
      phone: detailedInfo.data.person.phone,
      birthday: detailedInfo.data.person.birthday,
      firstName: detailedInfo.data.person.firstName,
      lastName: detailedInfo.data.person.lastName,
      middleName: detailedInfo.data.person.middleName,
      cookie: encrypt(cookie ?? '', ENCRYPT_KEY),
      cookieLastDateUpdate: formatDate(new Date().toISOString())
    }

    const regSPO: SPO = {
      abbreviation: SPO.abbreviation,
      name: SPO.name,
      shortName: SPO.shortName,
      actualAddress: SPO.actualAddress,
      email: SPO.email,
      site: SPO.site,
      phone: SPO.phone,
      type: SPO.type,
      directorName: SPO.directorName
    }

    const regGroup: Group = {
      groupName: student.groupName,
      diaryGroupId: student.groupId
    }

    const groupQueryBuilder = createQueryBuilder<Group>(client)
    const userDiaryQueryBuilder = createQueryBuilder<DatabaseDiaryUser>(client)
    const SPOQueryBuilder = createQueryBuilder<SPO>(client)

    const existingGroup = await groupQueryBuilder
      .from('groups')
      .select('*')
      .where(`"diaryGroupId" = ${regGroup.diaryGroupId}`)
      .first()
    const existingDiaryUser = await userDiaryQueryBuilder
      .from('diaryUser')
      .select('*')
      .where(`id = ${regData.id}`)
      .first()
    const existingSPO = await SPOQueryBuilder.from('SPO')
      .select('*')
      .where(`abbreviation = '${regSPO.abbreviation}'`)
      .first()

    if (!existingSPO) {
      const res = (await SPOQueryBuilder.insert(regSPO))?.[0] ?? null
      if (!res) throw new Error('Error insert SPO')
      regSPO.id = res.id
    } else {
      await SPOQueryBuilder.update(regSPO)
      regSPO.id = existingSPO.id
    }

    regGroup.spoId = regSPO.id
    if (!existingGroup) {
      const res = (await groupQueryBuilder.insert(regGroup))?.[0] ?? null
      if (!res) throw new Error('Error insert group')
      regGroup.id = res.id
    } else {
      await groupQueryBuilder.update(regGroup)
      regGroup.id = existingGroup.id
    }

    // Если всё ок, вносим id группы в пользователя
    regData.groupId = regGroup?.id ?? -1 // <- ???

    // Дальше всё как обычно
    if (!existingDiaryUser) {
      await userDiaryQueryBuilder.insert(regData)
    } else {
      await userDiaryQueryBuilder.update(regData)
    }

    // Генерируем токен
    regData.token = await generateToken(regData.id)

    // Убираем все "приватные" поля из ответа
    return ResponseLoginFromDiaryUser(regData, regSPO, regGroup)
  } catch (err) {
    console.error(err)
    throw new Error('Ошибка на этапе работы с базой: ')
  }
}
