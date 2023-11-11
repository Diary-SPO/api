import { type DiaryUser, type VKUser, type SPO, type Group, type PersonResponse } from '@types'
import { createQueryBuilder } from '@sqlBuilder'
import crypto from '@crypto'
import fetcher from '@src/api/fetcher'
import Hashes from 'jshashes'
import { SERVER_URL } from '@config'
import { UserData } from 'diary-shared'

export const registration = async (login: string, password: string, vkId: number): Promise<DiaryUser | number> => {
  const passwordHashed = new Hashes.SHA256().b64(password)
  const res = await fetcher<UserData>({
    url: `${SERVER_URL}/services/security/login`,
    method: 'POST',
    body: JSON.stringify({ login, password: passwordHashed, isRemember: true })
  })

  if (typeof res === 'number') return res

  try {
    const student = res.data.tenants[res.data.tenantName].students[0]
    const SPO = res.data.tenants[res.data.tenantName].settings.organization

    const setCookieHeader = res.headers.get('Set-Cookie')
    const cookie = Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader

    const detailedInfo = await fetcher<PersonResponse>({
      url: `${SERVER_URL}/services/security/account-settings`,
      cookie: cookie ?? ''
    })

    if (typeof detailedInfo === 'number') return detailedInfo

    const regData: DiaryUser = {
      id: student.id,
      groupId: student.groupId,
      login,
      password: crypto.encrypt(password ?? ''),
      phone: detailedInfo.data.person.phone,
      birthday: detailedInfo.data.person.birthday,
      firstName: detailedInfo.data.person.firstName,
      lastName: detailedInfo.data.person.lastName,
      middleName: detailedInfo.data.person.middleName,
      cookie: crypto.encrypt(cookie ?? '')
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

    const groupQueryBuilder = createQueryBuilder<Group>()
    const userDiaryQueryBuilder = createQueryBuilder<DiaryUser>()
    const userVKQueryBuilder = createQueryBuilder<VKUser>()
    const SPOQueryBuilder = createQueryBuilder<SPO>()

    const existingGroup = await groupQueryBuilder.from('groups').select('*').where(`"diaryGroupId" = ${regGroup.diaryGroupId}`).first()
    const existingDiaryUser = await userDiaryQueryBuilder.from('diaryUser').select('*').where(`id = ${regData.id}`).first()
    const existingVKUser = await userVKQueryBuilder.from('vkUser').select('*').where(`"vkId" = ${vkId}`).first()
    const existingSPO = await SPOQueryBuilder.from('SPO').select('*').where(`abbreviation = '${regSPO.abbreviation}'`).first()

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

    if (!existingVKUser) {
      await userVKQueryBuilder.insert({ diaryId: regData.id, vkId })
    } else {
      await userVKQueryBuilder.update({ diaryId: regData.id, vkId })
    }

    regData.cookie = crypto.decrypt(regData.cookie)

    return regData
  } catch (error) {
    console.log('Ошибка авторизации:', error)
    return 1
  }
  // 401 - ошибка запроса,
  // 501 - сервер упал.
  // 1   - неизвестная ошибка
}