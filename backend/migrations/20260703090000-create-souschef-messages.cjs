'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SousChefMessages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      recipeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Recipes',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      recipeRef: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      role: {
        allowNull: false,
        type: Sequelize.ENUM('user', 'assistant'),
      },
      text: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      language: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'id',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('SousChefMessages', ['userId', 'recipeId', 'createdAt']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('SousChefMessages');
  },
};