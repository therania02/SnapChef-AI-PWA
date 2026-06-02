'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Scan extends Model {
    static associate(models) {
      Scan.belongsTo(models.User, { foreignKey: 'userId' });
      models.User.hasMany(Scan, { foreignKey: 'userId' });
    }
  }

  Scan.init({
    image: DataTypes.TEXT('long'),
    ingredients: DataTypes.TEXT,
    rawRecipes: DataTypes.TEXT('long'),
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Scan',
  });

  return Scan;
};