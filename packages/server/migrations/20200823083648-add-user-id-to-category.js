module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    // Set category id sequence to 40 because we have added 39 records to category table manually
    // in 20200810082136-add-default-category.js migration
    await queryInterface.sequelize.query('ALTER SEQUENCE "Category_id_seq" RESTART WITH 40;', { transaction })

    await queryInterface.addColumn('Category', 'user_id', {
      type: Sequelize.DataTypes.UUID,
      allowNull: true,
      references: { model: 'User', key: 'id' },
    }, { transaction })

    await queryInterface.addIndex('Category', {
      fields: ['user_id'],
      name: 'category_user_id_index',
      transaction,
    })
  }),

  down: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('Category', 'category_user_id_index', { transaction })

    await queryInterface.removeColumn('Category', 'user_id', { transaction })
  }),
}
