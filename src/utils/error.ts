export const error = (message: unknown, ...args: (unknown | Error)[]) => {
  return console.error(`%c [handle error] ${message}`, 'color: violet', ...args)
}
