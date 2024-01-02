import { DAY_IN_MS } from '../config/constaints'

/**
 * Функция для форматирования даты в формате "YYYY-MM-DD".
 * @param {string} date - Строка с датой.
 * @returns {string} - Отформатированная дата.
 */
export const formatDate = (date: string): string => {
  return new Date(date).toISOString().substring(0, 10)
}

/**
 * Функция для вычисления разницы в днях между двумя датами.
 * @param {string} start - Начальная дата.
 * @param {string} end - Конечная дата.
 * @returns {number} - Разница в днях.
 */
export const calculateDifferenceInDays = (
  start: string,
  end: string
): number => {
  const startTimestamp = new Date(start).getTime()
  const endTimestamp = new Date(end).getTime()
  return (endTimestamp - startTimestamp) / DAY_IN_MS
}

/**
 * Функция для корректировки конечной даты, если разница в днях больше 14.
 * @param {string} start - Начальная дата.
 * @param {string} end - Конечная дата.
 * @returns {string} - Откорректированная конечная дата.
 */
export const adjustEndDate = (start: string, end: string): string => {
  const differenceInDays = calculateDifferenceInDays(start, end)

  if (differenceInDays > 14) {
    const newEndDate = new Date(new Date(start).getTime() + 14 * DAY_IN_MS)
    return formatDate(newEndDate.toISOString())
  }

  return formatDate(end)
}
