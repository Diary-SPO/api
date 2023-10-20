import { type Context } from 'elysia'

// export const preventCrossSiteScripting = (
//   _req: Request,
//   res: Response,
//   next: any
// ): void => {
//   res.headers.set('X-XSS-Protection', '1; mode=block')
//   next()
// }

interface CheckCookie {
  request: Request
  set: Context['set']
}

export const checkCookie = ({ request, set }: CheckCookie): number | undefined => {
  const secret = request.headers.get('secret')

  if (!secret || secret === '') {
    set.status = 401
    return 401
  }
  
  return
}
