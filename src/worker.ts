import { sleep } from 'bun'
import { cookieUpdater } from './srcWorker'

while (true) {
  await Promise.all<unknown>([cookieUpdater()])
  await sleep(1000) // разгружаем немного
}
