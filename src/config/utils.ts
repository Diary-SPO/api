import { type ParamsInit, type ParamsKeys } from './types'

function checkEnvVariables(params: ParamsInit): void {
  for (const key of Object.keys(params) as ParamsKeys[]) {
    const value = Bun.env[key] ?? params[key]

    if (typeof value !== 'number' && String(value).trim() === '') {
      throw new Error(`Environment variable ${key} is not defined or empty.`)
    }

    // @ts-ignore
    params[key] = value
  }
}

export default checkEnvVariables
