'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, { foreignKey: 'senderId' });
    }
  }

  Message.init({
    chatId: DataTypes.STRING,
    senderId: DataTypes.INTEGER,
    senderName: DataTypes.STRING,
    senderAvatar: DataTypes.TEXT,
    text: DataTypes.TEXT,
    image: DataTypes.TEXT,
    reactions: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Message',
  });

  return Message;
};