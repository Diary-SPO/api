import crypto from 'crypto'
import { ENCRYPT_KEY } from '@src/config'

export default {
  encrypt: (value: string): string => {
    const key = Buffer.from(ENCRYPT_KEY, 'utf-8')
    const iv = Buffer.alloc(16, 0)

    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv)
    let encryptedValue = cipher.update(value, 'utf-8', 'hex')
    encryptedValue += cipher.final('hex')

    return encryptedValue
  },
  decrypt: (value: string): string => {
    const key = Buffer.from(ENCRYPT_KEY, 'utf-8')
    const iv = Buffer.alloc(16, 0)

    const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv)
    let decryptedValue = decipher.update(value, 'hex', 'utf-8')
    decryptedValue += decipher.final('utf-8')

    return decryptedValue
  }
}