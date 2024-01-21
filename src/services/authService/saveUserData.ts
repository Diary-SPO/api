import { ApiError } from '@api'
import { ENCRYPT_KEY, SERVER_URL } from '@config'
import { client } from '@db'
import type { UserData } from '@diary-spo/shared'
import createQueryBuilder, { encrypt } from '@diary-spo/sql'
import { ResponseLoginFromDiaryUser } from '@types'
import {
  ApiResponse,
  cookieExtractor,
  error,
  fetcher,
  formatDate
} from '@utils'
import { generateToken } from '../generateToken'
import { DiaryUser, Group, PersonResponse, SPO } from '../types'

export const saveUserData = async (
  parsedRes: ApiResponse<UserData>,
  login: string,
  password: string
) => {
  try {
    const tenant = parsedRes.data.tenants[parsedRes.data.tenantName]
    const student = tenant.studentRole.students[0]
    const SPO = tenant.settings.organization

    const setCookieHeader = parsedRes.headers.get('Set-Cookie')
    const cookie = cookieExtractor(setCookieHeader ?? '')

    const detailedInfo = await fetcher<PersonResponse>({
      url: `${SERVER_URL}/services/security/account-settings`,
      cookie
    })

    if (typeof detailedInfo === 'number') {
      throw new ApiError('Error get detailed info!', 500)
    }

    const regData: DiaryUser = {
      id: student.id,
      groupId: student.groupId,
      login,
      token: '',
      password: encrypt(password ?? '', ENCRYPT_KEY),
      phone: detailedInfo.data.person.phone,
      birthday: detailedInfo.data.person.birthday,
      firstName: detailedInfo.data.person.firstName,
      lastName: detailedInfo.data.person.lastName,
      middleName: detailedInfo.data.person.middleName,
      cookie: encrypt(cookie, ENCRYPT_KEY),
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
      const res = (await SPOQueryBuilder.insert(regSPO))?.[0] ?? null

      if (!res) {
        error('Error insert SPO!')
        return null
      }

      regSPO.id = res.id
    } else {
      await SPOQueryBuilder.update(regSPO)
      regSPO.id = existingSPO.id
    }

    regGroup.spoId = regSPO.id

    if (!existingGroup) {
      const res = (await groupQueryBuilder.insert(regGroup))?.[0] ?? null

      if (!res) {
        error('Error insert group')
        return null
      }

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

    const token = await generateToken(regData.id)

    if (!token) {
      error('No token found!')
      return null
    }

    // Генерируем токен
    regData.token = token

    // Убираем все "приватные" поля из ответа
    return ResponseLoginFromDiaryUser(regData, regSPO, regGroup)
  } catch (err) {
    error(err)
    throw new Error('Ошибка на этапе работы с базой: ')
  }
}
