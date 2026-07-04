'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'preferredLanguage', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'id'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'preferredLanguage');
  }
};
