import type { DiaryUser, Group, SPO, DatabaseResponseLogin } from '@diary-spo/types'

export function ResponseLoginFromDiaryUser(
  diaryUser: DiaryUser,
  spo: SPO,
  group: Group
): DatabaseResponseLogin {
  return {
    id: diaryUser.id,
    groupId: diaryUser.groupId,
    groupName: group.groupName,
    organization: {
      abbreviation: spo.abbreviation,
      addressSettlement: spo.actualAddress
    },
    login: diaryUser.login,
    phone: diaryUser.phone,
    birthday: diaryUser.birthday,
    firstName: diaryUser.firstName,
    lastName: diaryUser.lastName,
    middleName: diaryUser.middleName,
    spoId: spo.id ?? -1,
    token: diaryUser.token ?? 'ERROR'
  }
}
