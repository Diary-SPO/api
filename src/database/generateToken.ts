import { client } from '@db'
import createQueryBuilder from '@diary-spo/sql'
import { Auth } from '@types'
import { suid } from 'rand-token'

export const generateToken = async (idDiaryUser: number): Promise<string> => {
  // Генерируем токен
  const token = suid(16)

  const date = new Date()
  const formattedDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`

  // Вставляем токен
  const tokenQueryBuilder = await createQueryBuilder<Auth>(client)
    .from('auth')
    .insert({
      idDiaryUser,
      token,
      lastDate: formattedDate,
    })

  if (!tokenQueryBuilder) {
    throw new Error('Error insert token!')
  }

  return token
}
