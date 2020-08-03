module.exports = {
  up: queryInterface => queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;'),
  down: queryInterface => queryInterface.sequelize.query('DROP EXTENSION pgcrypto;'),
}
