export const protectInjection = (value: string): string => {
  return value.replace('`', '').replace("'", '').replace('"', '')
}
