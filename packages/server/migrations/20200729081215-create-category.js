module.exports = {
  up: (queryInterface, Sequelize) => Promise.resolve()
    .then(async () => {
      await queryInterface.createTable('Category', {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        parent_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
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
    }),
  down: (queryInterface) => {
    return queryInterface.dropTable('Category')
  },
}
