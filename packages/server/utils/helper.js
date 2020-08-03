const crypto = require('crypto')

module.exports.randomString = (length = 8) => crypto.randomBytes(length).toString('hex')