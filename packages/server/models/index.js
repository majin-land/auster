const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const pg = require('pg')

// Workaround for casting `bigint` as `integer` instead of `string`
pg.defaults.parseInt8 = false

const basename = path.basename(module.filename)
const Config = require('../config')

const db = {}
let sequelize

const config = {
  ...Config.dbConfig,
  omitNull: true,
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000,
  },
  define: {
    // this underscored will allow auto transform underscore name to camelCase
    // so updatedAt will become updated_at
    underscored: true,

    // this freezeTableName allow us to ignore plural names
    // and have consistent model name and database name
    // database table name: Product model name: Product
    freezeTableName: true,

    // Set utf8 as default collation
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci',
      ssl: true,
    },
  },
  isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  logging: Config.env.PRODUCTION ? false : console.log,
}

if (Config.env.TEST) {
  config.logging = false
}

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize
db.Op = Sequelize.Op

module.exports = db
