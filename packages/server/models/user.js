const moment = require('moment')

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
    return this.get({ plain: true })
  }

  return User
}
