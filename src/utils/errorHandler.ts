import { isIContext } from '@utils'

let i = 0
export const handleErrors = (context: unknown): void => {
  console.log(context)
  if (!isIContext(context)) {
    console.error('No context')
    return
  }

  const response = context.response
  console.error(`[ERROR] #${++i}: ${String(context.response)}`)
  console.error('[path]', context.path)

  if (typeof response === 'number') {
    context.set.status = 401
    context.response = {
      errors: 'Auth failed',
      title: 'Where is your access token?'
    }

    console.error('[response]', context.response)
    return
  }

  if (response.errors) {
    context.set.status = 400

    context.response = {
      errors: response.errors,
      title: response.title
    }

    console.error('[response]', context.response)
    return
  }
}
