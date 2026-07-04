'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: 'userId' });
      User.hasMany(models.Comment, { foreignKey: 'userId' });
      User.hasMany(models.Message, { foreignKey: 'senderId' });
      User.hasMany(models.SousChefMessage, { foreignKey: 'userId' });
      User.hasMany(models.CookingHistory, { foreignKey: 'userId' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    scanLimit: DataTypes.INTEGER,
    lastScanDate: DataTypes.DATEONLY,
    premiumExpiresAt: DataTypes.DATE,
    cookingCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    dietPreferences: DataTypes.JSON,
    preferredLanguage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'id'
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};