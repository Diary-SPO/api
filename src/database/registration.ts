import type {
  DiaryUser,
  SPO,
  Group,
  PersonResponse,
  ResponseLogin,
} from '@diary-spo/types'
import { ENCRYPT_KEY, SERVER_URL } from '@config'
import { type UserData } from '@diary-spo/shared'
import createQueryBuilder, { fetcher, encrypt } from '@diary-spo/sql'
import { client } from '@db'
import { ResponseLoginFromDiaryUser } from '@types'
import { generateToken } from './generateToken'
import { offlineAuth } from './auth'
import { cookieExtractor } from 'src/utils/cookieExtractor'

/**
 * Регистрирует/авторизирует в оригинальном дневнике с сохранением данных в базе данных.
 * Может сохранять и обновлять данные о пользователе/группе/образовательной организации в случае успешной авторизации
 * @param login
 * @param password
 * @returns {ResponseLogin}
 */
export const registration = async (
  login: string,
  password: string,
): Promise<ResponseLogin> => {
  const res = await fetcher<UserData>({
    url: `${SERVER_URL}/services/security/login`,
    method: 'POST',
    body: JSON.stringify({ login, password, isRemember: true }),
  })

  if (res === 501) {
    return await offlineAuth(login, password).catch((err) => {
      throw new Error(
        'Authorization error: access to the diary was denied, and authorization through the database failed',
      )
    })
  }
  if (typeof res === 'number') throw new Error('Invalid username or password')

  try {
    const student = res.data.tenants[res.data.tenantName].students[0]
    const SPO = res.data.tenants[res.data.tenantName].settings.organization

    const setCookieHeader = res.headers.get('Set-Cookie')
    const cookie = cookieExtractor(setCookieHeader ?? '')

    const detailedInfo = await fetcher<PersonResponse>({
      url: `${SERVER_URL}/services/security/account-settings`,
      cookie: cookie,
    })

    if (typeof detailedInfo === 'number')
      throw new Error('Error get detailed info!')

    // TODO: add ENCRYPT_KEY
    const regData: DiaryUser = {
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
      directorName: SPO.directorName,
    }

    const regGroup: Group = {
      groupName: student.groupName,
      diaryGroupId: student.groupId,
    }

    const groupQueryBuilder = createQueryBuilder<Group>(client)
    const userDiaryQueryBuilder = createQueryBuilder<DiaryUser>(client)
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
      const res = await SPOQueryBuilder.insert(regSPO)
      if (!res) throw new Error('Error insert SPO')
      regSPO.id = res.id
    } else {
      await SPOQueryBuilder.update(regSPO)
      regSPO.id = existingSPO.id
    }

    if (!existingGroup) {
      const res = await groupQueryBuilder.insert(regGroup)
      if (!res) throw new Error('Error insert group')
      regGroup.id = res.id
    } else {
      await groupQueryBuilder.update(regGroup)
      regGroup.id = existingGroup.id
    }

    // Если всё ок, вносим id группы в пользователя
    regData.groupId = regGroup.id ?? -1 // <- ???

    // Дальше всё как обычно
    if (!existingDiaryUser) {
      await userDiaryQueryBuilder.insert(regData)
    } else {
      await userDiaryQueryBuilder.update(regData)
    }

    // Генерируем токен
    const token = await generateToken(regData.id)

    // Не вычисляем, т.к. не отдаём
    //regData.cookie = decrypt(regData.cookie, ENCRYPT_KEY)
    regData.token = token

    // Убираем все "приватные" поля из ответа
    return ResponseLoginFromDiaryUser(regData, regSPO, regGroup)
  } catch (err) {
    throw new Error('Ошибка на этапе работы с базой: ' + err)
  }
}
