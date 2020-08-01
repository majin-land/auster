module.exports = {
  up: (queryInterface, Sequelize) => Promise.resolve()
    .then(async () => {
      await queryInterface.createTable('Session', {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        token: {
          type: Sequelize.TEXT,
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
        deleted_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
          allowNull: true,
        },
      })
      await queryInterface.addIndex('Session', {
        name: 'session_user_id_index',
        fields: ['user_id'],
      })
    }),
  down: (queryInterface) => {
    return queryInterface.dropTable('Session')
  },
}
