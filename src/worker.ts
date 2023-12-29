import { cookieUpdater } from './srcWorker'
import { sleep } from 'bun'

while (true) {
  await Promise.all<unknown>([
    cookieUpdater()
  ])
  await sleep(1000) // разгружаем немного
}
