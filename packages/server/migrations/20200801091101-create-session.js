module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('Session', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'User', key: 'id' },
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    })

    await queryInterface.addIndex('Session', {
      name: 'session_user_id_index',
      fields: ['user_id'],
      transaction,
    })

    await queryInterface.addIndex('Session', {
      name: 'session_token_index',
      fields: ['token'],
      transaction,
    })
  }),
  down: (queryInterface) => {
    return queryInterface.dropTable('Session')
  },
}
