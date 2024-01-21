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
      password,
      token: '',
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
    const [SPORecord, SPOCreated] = await SPOModel.findOrCreate(
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

    regSPO.id = SPORecord.dataValues.id

    // Определяем группу
    const [groupRecord, groupCreated] = await GroupsModel.findOrCreate({
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

    regData.groupId = groupRecord.dataValues.id

    // Определяем пользователя
    const [diaryUserRecord, diaryUserCreated] = await DiaryUserModel.findOrCreate({
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
    error(err)
    throw new Error('Ошибка на этапе работы с базой: ')
  }
}