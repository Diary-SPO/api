export * from './converterTypes'

import type { Context as ElysiaContext } from 'elysia'

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
export interface IContext extends ElysiaContext {
  response: IResponse
}

export interface ContextWithID extends Omit<ElysiaContext, 'params'> {
  params: {
    id: string
  }
}
