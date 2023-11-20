export const protectInjection = (value: string): string => {
  return Buffer.from(value, 'utf-8').toString()
    .replaceAll('`', '').replaceAll("'", '').replaceAll('"', '')
}
