'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Recipes', 'titleEn', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Recipes', 'ingredientsEn', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('Recipes', 'instructionsEn', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Recipes', 'instructionsEn');
    await queryInterface.removeColumn('Recipes', 'ingredientsEn');
    await queryInterface.removeColumn('Recipes', 'titleEn');
  },
};