import { type Context, isIContext } from '@utils'

let i = 0
export const handleErrors = (context: Context): void => {
  if (!isIContext(context)) {
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
