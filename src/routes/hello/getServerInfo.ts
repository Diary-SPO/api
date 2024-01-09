import { SERVER_URL } from '@config'
import * as process from 'process'
import {getGitCommitHash} from "./getGitCommitHash";
import {IServerInfo} from "@types";

export const getServerInfo = async (): Promise<IServerInfo> => {
  return {
    status: 'ok',
    arch: process.arch,
    targetDiary: SERVER_URL,
    backend: 'bun+elysia',
    commit: await getGitCommitHash() ?? 'noVersion'
  }
}
