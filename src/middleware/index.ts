import { type Context } from 'elysia'

interface CheckCookie {
  request: Request
  set: Context['set']
}

export const checkCookie = ({
  request,
  set,
}: CheckCookie): number | undefined => {
  const secret = request.headers.get('secret')

  if (secret) {
    return
  }

  set.status = 401
  return 401
}
