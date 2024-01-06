import type { DiaryUser, ResponseLogin } from '@diary-spo/types'

export interface DatabaseDiaryUser extends DiaryUser {
  cookieLastDateUpdate: string
}

export interface DatabaseResponseLogin extends ResponseLogin {
  id: number
  groupName: string
  firstName: string
  lastName: string
  middleName: string
}

export interface CookieInfoFromDatabase {
  id: number
  idDiaryUser: number
  token: string
  lastUsedDate: string
  cookie: string
}