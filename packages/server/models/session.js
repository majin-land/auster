const moment = require('moment')
const { Model, DataTypes } = require('sequelize')

const { db } = require('./db')
const { randomString } = require('../utils/helper')

class Session extends Model {
  display() {
    return this.get({ plain: true })
  }
}

Session.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: db,
  tableName: 'Session',
  getterMethods: {
    createdAt() {
      return moment(this.getDataValue('createdAt')).format()
    },
    updatedAt() {
      return moment(this.getDataValue('updatedAt')).format()
    },
  },
})

Session.generateAccess = async (id) => {
  let transaction = null
  try {
    transaction = await db.transaction()

    await Session.destroy({ where: { userId: id }, transaction })

    const session = await Session.create({
      userId: id,
      token: randomString(20),
    }, { transaction })

    await transaction.commit()

    return session.token
  } catch (e) {
    if (transaction) await transaction.rollback()
    throw new Error('Generate access token error')
  }
}

Session.belongsTo(db.models.User, { as: 'user' })

module.exports = Session
