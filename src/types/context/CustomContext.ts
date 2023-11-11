import { type IContext, type ISessionContext } from '@vk-io/session'
import { type DiaryUser } from '../database'

export interface CustomContext extends IContext {
  subTypes: string[]
  id: number
  senderId: number
  text: string
  scene: {
    state: {
      isAuth: boolean
      diaryUser: DiaryUser
    }
    enter: (sceneName: string) => void
  }
  session: ISessionContext
}

export type CustomNext = () => void
