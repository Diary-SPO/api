import type { DiaryUser, VKUser, SPO, Group, PersonResponse, Auth, ResponseLogin } from '@types'
import { ENCRYPT_KEY, SERVER_URL } from '@config'
import { type UserData } from '@diary-spo/shared'
import createQueryBuilder, { fetcher, encrypt, decrypt } from '@diary-spo/sql'
import { client } from '@db'
import { suid } from 'rand-token'
import { ResponseLoginFromDiaryUser } from '@types'
import { generateToken } from './generateToken'

export const registration = async (
  login: string,
  password: string
): Promise<ResponseLogin> => {
  const res = await fetcher<UserData>({
    url: `${SERVER_URL}/services/security/login`,
    method: 'POST',
    body: JSON.stringify({ login, password, isRemember: true }),
  })

  if (res === 501) throw new Error('Authorization error: the diary was denied access')
  if (typeof res === 'number') throw new Error('Ошибочка с авторизацией: неверный логин или пароль')

  try {
    const student = res.data.tenants[res.data.tenantName].students[0]
    const SPO = res.data.tenants[res.data.tenantName].settings.organization

    const setCookieHeader = res.headers.get('Set-Cookie')
    const cookie = Array.isArray(setCookieHeader)
      ? setCookieHeader.join('; ')
      : setCookieHeader

    const detailedInfo = await fetcher<PersonResponse>({
      url: `${SERVER_URL}/services/security/account-settings`,
      cookie: cookie ?? '',
    })

    if (typeof detailedInfo === 'number') throw new Error('Error get detailed info!')

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

    const actualSPO: SPO = regSPO
    const actualGroup: Group = regGroup

    if (!existingSPO) {
      const res = await SPOQueryBuilder.insert(regSPO)
      if (!res) throw new Error('Error insert SPO')
      actualSPO.id = res.id
    } else {
      await SPOQueryBuilder.update(regSPO)
      actualSPO.id = existingSPO.id
    }
    regGroup.spoId = actualSPO.id
    regData.spoId = actualSPO.id

    if (!existingGroup) {
      const res = await groupQueryBuilder.insert(regGroup)
      if (!res) throw new Error('Error insert group')
      actualGroup.id = res.id
    } else {
      await groupQueryBuilder.update(regGroup)
      actualGroup.id = existingGroup.id
    }

    // Если всё ок, вносим id группы в пользователя
    regData.groupId = actualGroup.id ?? -1 // <- ???

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
    return ResponseLoginFromDiaryUser(regData)
  } catch (err) {
    throw new Error('Ошибка на этапе работы с базой: ' + err)
  }
}
