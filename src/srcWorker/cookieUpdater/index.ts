import { intervalRun } from './config'
import { checkInterval } from '../utils/checkInterval'
import { logger } from '../utils/logger'
import { updaterCookies } from './modules/updaterCookies'
import { removeNotUsedTokens } from './modules/removeNotUsedTokens'

let lastRunning: Date | null = null
const log = logger('cookie updater')

export const cookieUpdater = async (): Promise<void> => {
  if (lastRunning && !checkInterval(lastRunning, intervalRun)) {
    return
  }

  lastRunning = new Date()

  log('Запускаю проход... ' + new Date().toISOString())

  // Обрабатываем и проверяем, нужно ли перевыпустить куки
  // ---------------------------------------------------->

  // 1. Обновляем куки
  await updaterCookies()

  // 2. Удаляем неиспользуемые токены
  await removeNotUsedTokens()

  log(`Проход завершён. Следующий через ${intervalRun} секунд`)
}
