// set default env if not provided
require('dotenv').config({ path: '../../.env' })

const ENV = process.env.NODE_ENV || 'development'
const Config = require('./config')

module.exports = {
  dbConfig: Config[ENV],
  env: {
    PRODUCTION: ENV === 'production',
    DEVELOPMENT: ENV === 'development',
    TEST: ENV === 'test',
  },
}
