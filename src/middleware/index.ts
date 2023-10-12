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

  if (!secret || typeof secret !== 'string' || secret === '') {
    set.status = 401
    return 401
  }
}

// const allowedHosts = ['localhost', 'https://prod-app51740302']
//
// const isHostAllowed = (host: string): boolean => {
//   console.log(allowedHosts.some(allowedHost => host.includes(allowedHost)))
//   return allowedHosts.some(allowedHost => host.includes(allowedHost))
// }
