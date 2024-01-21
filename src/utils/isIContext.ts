import { IContext } from '@types'

export const isIContext = (obj: unknown): obj is IContext => {
  return Boolean(
    obj &&
      typeof obj === 'object' &&
      'response' in obj &&
      'request' in obj &&
      'set' in obj &&
      typeof obj.response === 'object' &&
      typeof obj.request === 'object' &&
      typeof obj.set === 'object' &&
      obj.set !== null &&
      'status' in obj.set
  )
}
