'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
      Recipe.hasMany(models.SousChefMessage, { foreignKey: 'recipeId' });
    }
  }
  Recipe.init({
    title: DataTypes.STRING,
    titleEn: DataTypes.STRING,
    ingredients: DataTypes.TEXT,
    ingredientsEn: DataTypes.TEXT,
    instructions: DataTypes.TEXT,
    instructionsEn: DataTypes.TEXT,

    detectedIngredients: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    image_url: DataTypes.STRING,
    calories: DataTypes.INTEGER,
    protein: DataTypes.INTEGER,
    carbs: DataTypes.INTEGER,
    prepTime: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Recipe',
  });
  return Recipe;
};