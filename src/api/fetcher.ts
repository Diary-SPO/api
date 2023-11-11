import fetch from 'node-fetch'
import { type ApiResponse, type HTTPMethods } from './types'

interface Params {
  url: string
  method?: HTTPMethods
  // TODO: типизировать потом (можно через дженерик)
  body?: any
  cookie?: string
}

export default async function <T> ({
  url,
  method = 'GET',
  body,
  cookie = ''
}: Params): Promise<ApiResponse<T> | number> {
  try {
    const response = await fetch(url, {
      method,
      body,
      headers: { 'Content-Type': 'application/json;charset=UTF-8', Cookie: cookie }
    })

    if (!response.ok) {
      return 401
    }

    return {
      data: await response.json() as T,
      headers: response.headers,
      status: response.status
    }
  } catch (error) {
    return 501
  }
}
