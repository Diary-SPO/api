import { ENCRYPT_KEY, SERVER_URL } from '@config'
import { type UserData } from '@diary-spo/shared'
import { fetcher } from '@diary-spo/sql'
import type {
  DiaryUser,
  Group,
  PersonResponse,
  ResponseLogin,
  SPO
} from '@diary-spo/types'
import { ResponseLoginFromDiaryUser } from '@types'
import { formatDate } from '@utils'
import { cookieExtractor } from 'src/utils/cookieExtractor'
import { offlineAuth } from './auth'
import { generateToken } from './generateToken'
import { SPOModel } from './models'
import { GroupsModel } from './models'
import { DiaryUserModel } from './models'

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
): Promise<DiaryUser | ResponseLogin | null> => {
  const res = await fetcher<UserData>({
    url: `${SERVER_URL}/services/security/login`,
    method: 'POST',
    body: JSON.stringify({ login, password, isRemember: true })
  })

  if (Number(res) > 401) {
    const authData = await offlineAuth(login, password).catch((err) => {
      throw new Error(
        `Authorization error: access to the diary was denied, and authorization through the database failed. Full: ${err}`
      )
    })

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

    const regData: DiaryUser = {
      id: student.id,
      groupId: student.groupId,
      login,
      password,
      phone: detailedInfo.data.person.phone,
      birthday: detailedInfo.data.person.birthday,
      firstName: detailedInfo.data.person.firstName,
      lastName: detailedInfo.data.person.lastName,
      middleName: detailedInfo.data.person.middleName,
      cookie,
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

    // Определяем СПО
    const [SPORecord, SPOCreated] = await SPOModel().findOrCreate(
      {
        where: {
          abbreviation: regSPO.abbreviation
        },
        defaults: {
          ...regSPO
        }
      }
    )

    if (!SPOCreated) {
      SPORecord.update({...regSPO})
    }

    // Определяем группу
    const [groupRecord, groupCreated] = await GroupsModel().findOrCreate({
      where: {
        diaryGroupId: regGroup.diaryGroupId
      },
      defaults: {
        ...regGroup,
        spoId: SPORecord.dataValues.id
      }
    })

    if (!groupCreated) {
      groupRecord.update({
        ...regGroup,
        spoId: SPORecord.dataValues.id
      })
    }

    // Определяем пользователя
    const [diaryUserRecord, diaryUserCreated] = await DiaryUserModel().findOrCreate({
      where: {
        id: regData.id
      },
      defaults: {
        ...regData,
        groupId: groupRecord.dataValues.id
      }
    })

    if (!diaryUserCreated) {
      diaryUserRecord.update({
        ...regData,
        groupId: groupRecord.dataValues.id
      })
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
