import { type Cookie } from 'elysia'

interface IResponse {
  errors?: unknown,
  title?: unknown
}

interface IContext {
  response: IResponse
  body: unknown
  headers: Record<string, string | null>
  cookie: Record<string, Cookie<any>>
  set: { status: number }
  request: Request
}

function handleErrors (context: IContext): void {
  if (context.response.errors) {
    context.set.status = 400

    context.response = {
      errors: context.response.errors,
      title: context.response.title
    }
  }
}

export default handleErrors
