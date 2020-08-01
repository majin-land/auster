const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    token: {
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

  Session.generateAccess = async (id) => {
    let transaction = null
    try {
      transaction = await sequelize.transaction()

      await Session.destroy({ where: { userId: id }, transaction })

      const session = await Session.create(
        {
          userId: id,
          token: randomString(20),
        },
        { transaction },
      )

      await transaction.commit()

      return session.token
    } catch (e) {
      if (transaction) await transaction.rollback()
      throw new Error('Generate access token error')
    }
  }

  return Session
}
