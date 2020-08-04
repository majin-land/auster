const moment = require('moment')

const { deletedEmail } = require('../utils/helper')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
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
        this.setDataValue('password', sequelize.fn('crypt', password, sequelize.fn('gen_salt', 'md5')))
      },
    },
  }, {
    paranoid: true,
    getterMethods: {
      createdAt() {
        return moment(this.getDataValue('createdAt')).format()
      },
      updatedAt() {
        return moment(this.getDataValue('updatedAt')).format()
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
        password: sequelize.fn('crypt', password, sequelize.col('password')),
      },
    })
  }

  User.prototype.display = function () {
    const { deletedAt, password, ...user } = this.get({ plain: true })
    return user
  }

  return User
}
