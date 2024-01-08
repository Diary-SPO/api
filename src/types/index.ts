export * from './converterTypes'

import type { Context } from 'elysia'

/**
 * Интерфейс для ответа.
 */
export interface IResponse {
  errors?: unknown
  title?: unknown
}

/**
 * Интерфейс контекста с расширенными свойствами.
 */
export interface IContext extends Context {
  response: IResponse
}

export interface ContextWithID extends Omit<Context, 'params'> {
  params: {
    id: string
  }
}
