const crypto = require('crypto')
const moment = require('moment')

module.exports.randomString = (length = 8) => crypto.randomBytes(length).toString('hex')

module.exports.deletedEmail = (email) => {
  const parts = email.split('@')
  return `${parts[0]}+deleted_${moment().format('YYYY-MM-DD_HH:mm:ss')}@${parts[1]}`
}
