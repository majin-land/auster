module.exports = {
  up: (queryInterface, Sequelize) => Promise.resolve()
    .then(async () => {
      await queryInterface.createTable('Record', {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        type: {
          type: Sequelize.TEXT,
          defaultValue: 'expense',
          allowNull: false,
        },
        category_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        amount: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
        },
        transaction_date: {
          type: Sequelize.DATE,
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
      await queryInterface.addIndex('Record', {
        name: 'record_category_id_index',
        fields: ['category_id'],
      })
    }),
  down: (queryInterface) => {
    return queryInterface.dropTable('Record')
  },
}
