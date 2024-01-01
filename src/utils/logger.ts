export const logger = (nameUtils: string) => {
  return (message) => { console.log(`WORKER [${nameUtils}]: ${message}`) }
}
