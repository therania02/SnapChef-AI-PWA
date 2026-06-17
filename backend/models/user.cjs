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
    dietPreferences: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};