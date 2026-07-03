'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Scans', 'ingredientsEn', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('Scans', 'rawRecipesEn', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Scans', 'rawRecipesEn');
    await queryInterface.removeColumn('Scans', 'ingredientsEn');
  },
};