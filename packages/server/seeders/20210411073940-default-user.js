module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.bulkInsert('User', [{
      name: 'User',
      email: 'user@email.com',
      password: Sequelize.fn('crypt', 'password', Sequelize.fn('gen_salt', 'md5')),
      created_at: new Date(),
      updated_at: new Date(),
    }], { transaction })
  }),

  down: async (queryInterface) => {
    await queryInterface.bulkDelete({ tableName: 'User', truncate: true, cascade: true })
  },
}
