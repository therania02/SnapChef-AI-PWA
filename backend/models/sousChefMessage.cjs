'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SousChefMessage extends Model {
    static associate(models) {
      SousChefMessage.belongsTo(models.User, { foreignKey: 'userId' });
      SousChefMessage.belongsTo(models.Recipe, { foreignKey: 'recipeId' });
    }
  }

  SousChefMessage.init(
    {
      userId: DataTypes.INTEGER,
      recipeId: DataTypes.INTEGER,
      recipeRef: DataTypes.STRING,
      role: DataTypes.STRING,
      text: DataTypes.TEXT,
      language: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'SousChefMessage',
    }
  );

  return SousChefMessage;
};