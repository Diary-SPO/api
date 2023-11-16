import type { Context as ElysiaContext, Cookie } from 'elysia'
import type { GenericRecord, RecordNonNull, RecordNullable } from '@utils'

/**
 * Интерфейс для ответа.
 */
export interface IResponse {
  errors?: unknown
  title?: unknown
}

/**
 * Интерфейс контекста сервера.
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
   * Параметры запроса.
   */
  query: RecordNullable<string>

  /**
   * Параметры запроса.
   */
  params: RecordNonNull<string>

  /**
   * Заголовки запроса.
   */
  headers: RecordNullable<string>

  /**
   * Cookie.
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

export interface ContextWithID extends Omit<ElysiaContext, 'params'> {
  params: {
    id: string
  }
}
