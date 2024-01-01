import { checkInterval } from '../utils/checkInterval'
import { logger } from '../utils/logger'
import { intervalRun } from './config'
import { removeNotUsedTokens } from './modules/removeNotUsedTokens'
import { updaterCookies } from './modules/updaterCookies'

let lastRunning: Date | null = null
const log = logger('cookie updater')

export const cookieUpdater = async (): Promise<void> => {
  if (lastRunning && !checkInterval(lastRunning, intervalRun)) {
    return
  }

  lastRunning = new Date()

  log(`Запускаю проход... ${new Date().toISOString()}`)

  // Обрабатываем и проверяем, нужно ли перевыпустить куки
  // ---------------------------------------------------->

  // 1. Обновляем куки
  await updaterCookies()

  // 2. Удаляем неиспользуемые токены
  await removeNotUsedTokens()

  log(`Проход завершён. Следующий через ${intervalRun} секунд`)
}
