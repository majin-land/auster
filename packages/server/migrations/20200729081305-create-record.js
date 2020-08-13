module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('Record', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'User', key: 'id' },
      },
      category_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'Category', key: 'id' },
      },
      type: {
        type: Sequelize.TEXT,
        defaultValue: 'expense',
        allowNull: false,
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
      note: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex('Record', {
      name: 'record_category_id_index',
      fields: ['category_id'],
    }, { transaction })

    await queryInterface.addIndex('Record', {
      name: 'record_user_id_index',
      fields: ['user_id'],
    }, { transaction })
  }),
  down: (queryInterface) => {
    return queryInterface.dropTable('Record')
  },
}
