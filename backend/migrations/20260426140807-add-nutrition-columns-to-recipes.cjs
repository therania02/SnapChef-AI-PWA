'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn('recipes', 'calories', {

      type: Sequelize.INTEGER,

      allowNull: true,

    });

    await queryInterface.addColumn('recipes', 'protein', {

      type: Sequelize.INTEGER,

      allowNull: true,

    });

    await queryInterface.addColumn('recipes', 'carbs', {

      type: Sequelize.INTEGER,

      allowNull: true,

    });

    await queryInterface.addColumn('recipes', 'prepTime', {

      type: Sequelize.INTEGER,

      allowNull: true,

    });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn('recipes', 'calories');

    await queryInterface.removeColumn('recipes', 'protein');

    await queryInterface.removeColumn('recipes', 'carbs');

    await queryInterface.removeColumn('recipes', 'prepTime');

  }

};
