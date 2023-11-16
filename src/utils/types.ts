import type { Cookie } from 'elysia'

/**
 * Общий тип для записей с неизвестными значениями.
 */
type GenericRecord = Record<string, unknown>

/**
 * Общий тип для записей с возможностью значения null.
 */
type RecordNullable<T> = Record<string, T | null>

/**
 * Общий тип для записей без значений null.
 */
type RecordNonNull<T> = Record<string, T>

/**
 * Интерфейс для ответа.
 */
export interface IResponse {
  errors?: unknown
  title?: unknown
}

/**
 * Интерфейс контекста приложения.
 */
export interface Context {
  /**
   * Объект ответа.
   */
  response: unknown

  /**
   * Тело запроса.
   */
  body: unknown

  /**
   * Параметры запроса с возможностью значения null.
   */
  query: RecordNullable<string>

  /**
   * Параметры запроса без значений null.
   */
  params: RecordNonNull<string>

  /**
   * Заголовки запроса с возможностью значения null.
   */
  headers: RecordNullable<string>

  /**
   * Cookie с неизвестными значениями.
   */
  cookie: RecordNonNull<Cookie<any>>

  /**
   * Общий объект для установки различных значений.
   */
  set: GenericRecord

  /**
   * Путь запроса.
   */
  path: string

  /**
   * Объект запроса.
   */
  request: Request

  /**
   * Общий объект для хранения данных.
   */
  store: GenericRecord
}

/**
 * Интерфейс контекста с расширенными свойствами.
 */
export interface IContext extends Context {
  response: IResponse
}
