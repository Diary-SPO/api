import { type Teacher } from '@diary-spo/shared'

/**
 * Структура таблицы, хранящей студента
 */
export interface DiaryUser {
  id: number
  spoId?: number
  groupId: number
  login: string
  password: string
  phone: string
  birthday: string
  firstName: string
  lastName: string
  middleName: string
  cookie: string
  token?: string
}

/**
 * Структура таблицы, хронящей информацию о группе студента
 */
export interface Group {
  id?: number
  groupName: string
  diaryGroupId: number
  spoId?: number
}

/**
 * Структура таблицы, хранящей информацию о учебной организации
 */
export interface SPO {
  id?: number
  abbreviation: string
  name: string
  shortName: string
  actualAddress: string
  email: string
  site: string
  phone: string
  type: string
  directorName: string
}

/**
 * ???
 */
export interface PersonResponse {
  person: {
    birthday: string
    firstName: string
    id: number
    isEsiaBound: boolean
    lastName: string
    login: string
    middleName: string
    phone: string
    trusted: boolean
  }
}

/**
 * Структура таблицы, содержащей расписание группы
 */
export interface Schedule {
  id?: number
  groupId?: number
  teacherId: number | null
  classroomBuilding: string | null
  classroomName: string | null
  subjectName: string
  date: string
  startTime: string
  endTime: string
}

/**
 * Структура таблицы, хранящей преподавателей
 */
export interface TeacherDB extends Teacher {
  spoId: number
}

/**
 * Структура таблицы, хранящей задание
 */
export interface GradebookDB {
  id?: number
  scheduleId: number
  lessonTypeId: number
}

/**
 * Структура таблицы, хранящей тип занятия
 */
export interface LessonTypeDB {
  id?: number
  name: string
}

/**
 * Структура таблицы, хранящей темы
 */
export interface ThemeDB {
  id?: number
  gradebookId: number
  description: string
}

/**
 * Структура таблицы, хранящей темы занятий
 */
export interface TaskDB {
  id: number
  gradebookId: number
  taskTypeId: number
  topic: string
}

/**
 * Структура таблицы, хранящей обязательность выполнения задания (получения оценки)
 */
export interface RequiredDB {
  diaryUserId: number
  taskId: number
  isRequired: boolean
}

/**
 * ???
 */
export interface AuthData {
  cookie: string
  data: DiaryUser
}

/**
 * Структура таблицы, хранящей токены доступа через пользователя
 */
export interface Auth {
  id: number
  idDiaryUser: number
  token: string
  lastDate: string
  lastUsedDate: string
}

/**
 * Структура ответа на запрос авторизации (/login)
 */
export interface ResponseLogin {
  id: number
  spoId?: number
  groupId: number
  groupName: string
  organization: {
    abbreviation: string
    addressSettlement: string
  }
  login: string
  phone: string
  birthday: string
  firstName: string
  lastName: string
  middleName: string
  token?: string
}

/**
 * Структура таблицы auth, хранящей токены
 */
export interface TokenDetailedInfo {
  id?: number
  idDiaryUser: number
  token: string
  lastDate: string
  lastUsedDate: string
}

/**
 * Структура для извлечения куки
 */
export interface CookieGetDetailedInfo extends TokenDetailedInfo {
  cookie: string
}
