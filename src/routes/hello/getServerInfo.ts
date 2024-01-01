import { SERVER_URL } from '@config'
import * as process from 'process'
import { getGitCommitHash } from './getGitCommitHash'

export const getServerInfo = (): object => {
  return {
    status: 'ok',
    arch: process.arch,
    targetDiary: SERVER_URL,
    backend: 'bun+elysia',
    commit: getGitCommitHash() ?? 'noVersion'
  }
}
