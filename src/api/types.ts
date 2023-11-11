import { type Headers } from 'node-fetch'

export type HTTPMethods = 'GET' | 'POST'

export interface ApiResponse<T> {
  data: T
  headers: Headers
  status: number
}
