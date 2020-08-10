const moment = require('moment')
const { Model, DataTypes } = require('sequelize')

const { db } = require('./db')
const { deletedEmail } = require('../utils/helper')

class User extends Model {
  display() {
    const { deletedAt, password, ...user } = this.get({ plain: true })
    return user
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
    set(password) {
      this.setDataValue('password', db.fn('crypt', password, db.fn('gen_salt', 'md5')))
    },
  },
}, {
  sequelize: db,
  tableName: 'User',
  getterMethods: {
    created_at() {
      return moment(this.getDataValue('created_at')).format()
    },
    updated_at() {
      return moment(this.getDataValue('updated_at')).format()
    },
  },
  hooks: {
    beforeDestroy: async (instance, options) => {
      await instance.update({ email: deletedEmail(instance.email) }, options)
    },
  },
})

User.validatePassword = (email, password) => {
  return User.findOne({
    where: {
      email,
      password: db.fn('crypt', password, db.col('password')),
    },
  })
}

module.exports = User
