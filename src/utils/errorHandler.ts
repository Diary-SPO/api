import { isIContext } from '@utils'

let i = 0
export const handleErrors = (context: unknown): void => {
  if (!isIContext(context)) {
    console.error('No context')
    return
  }

  if (context.response.errors) {
    context.set.status = 400

    console.error(`[ERROR] #${++i}: ${context.response.title as string}`)
    console.error(context.response)
    context.response = {
      errors: context.response.errors,
      title: context.response.title
    }
  }
}
