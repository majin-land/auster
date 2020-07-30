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
      defaultValue: '',
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

  User.prototype.display = function () {
    return this.get({ plain: true })
  }

  return User
}
