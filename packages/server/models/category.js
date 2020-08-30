const moment = require('moment')
const { Model, DataTypes } = require('sequelize')

const { db } = require('./db')

class Category extends Model {
  display() {
    return this.get({ plain: true })
  }
}

Category.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.TEXT,
    defaultValue: 'expense',
    allowNull: false,
  },
  parentId: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  sequelize: db,
  tableName: 'Category',
  getterMethods: {
    createdAt() {
      return moment(this.getDataValue('createdAt')).format()
    },
    updatedAt() {
      return moment(this.getDataValue('updatedAt')).format()
    },
  },
})

module.exports = Category
