module.exports = {
  up: (queryInterface, Sequelize) => Promise.resolve()
    .then(async () => {
      await queryInterface.createTable('User', {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        name: {
          type: Sequelize.TEXT,
          allowNull: false,
          defaultValue: '',
        },
        email: {
          type: Sequelize.TEXT,
          allowNull: false,
          defaultValue: '',
        },
        password: {
          type: Sequelize.TEXT,
          allowNull: false,
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
    }),
  down: (queryInterface) => {
    return queryInterface.dropTable('User')
  },
}
