const moment = require('moment')
const { Model, DataTypes } = require('sequelize')

const { db } = require('./db')

class Record extends Model {
  display() {
    return this.get({ plain: true })
  }
}

Record.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  type: {
    type: DataTypes.TEXT,
    defaultValue: 'expense',
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    get() {
      return Number(this.getDataValue('amount'))
    },
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize: db,
  tableName: 'Record',
  getterMethods: {
    createdAt() {
      return moment(this.getDataValue('createdAt')).format()
    },
    updatedAt() {
      return moment(this.getDataValue('updatedAt')).format()
    },
  },
})

Record.belongsTo(db.models.Category, { as: 'category' })

module.exports = Record
