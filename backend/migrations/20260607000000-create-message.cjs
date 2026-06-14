'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      chatId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      senderId: {
        type: Sequelize.INTEGER
      },
      senderName: {
        type: Sequelize.STRING
      },
      senderAvatar: {
        type: Sequelize.TEXT
      },
      text: {
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.TEXT
      },
      reactions: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('Messages', ['chatId', 'createdAt']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Messages');
  }
};