import crypto from 'crypto'

/**
 * 加密字符串
 * @param {string} data 原文
 * @param {string} key 密钥
 */
export function aesEncrypt (data, key) {
  const cipher = crypto.createCipher('aes192', key)
  var crypted = cipher.update(data, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

/**
 * 解密字符串
 * @param {string} encrypted 密文
 * @param {string} key 密钥
 */
export function aesDecrypt (encrypted, key) {
  const decipher = crypto.createDecipher('aes192', key)
  var decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
