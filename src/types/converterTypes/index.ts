import { DiaryUser, ResponseLogin } from '../database'

export function ResponseLoginFromDiaryUser(
  diaryUser: DiaryUser,
): ResponseLogin {
  return {
    id: diaryUser.id,
    groupId: diaryUser.groupId,
    login: diaryUser.login,
    phone: diaryUser.phone,
    birthday: diaryUser.birthday,
    firstName: diaryUser.firstName,
    lastName: diaryUser.lastName,
    middleName: diaryUser.middleName,
    spoId: diaryUser.spoId,
    token: diaryUser.token,
  }
}
