/**
 * Оставляет от куки только нужную часть, выкинув все остальные
 * @param setCookieHeader
 * @returns {string} cookie
 */
export const cookieExtractor = (setCookieHeader: string): string => {
  // Подготавливаем куку
  const cookie = setCookieHeader
    .split(';')
    .map((value) => {
      if (value.indexOf('UID') !== -1) {
        return value + '; path=/;'
      }
      if (value.indexOf('.AspNetCore.Cookies') !== -1) {
        return value + '; path=/; samesite=lax; httponly'
      }
    })
    .join('')

  // Будет кука формата UID=vSADsfgasdfADSFsadfSAD...
  return cookie
}
