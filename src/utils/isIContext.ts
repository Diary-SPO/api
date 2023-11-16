import type { Context, IContext } from '@src/utils/types'

export const isIContext = (obj: Context): obj is IContext => {
  return (
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
