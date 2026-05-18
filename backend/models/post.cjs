'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relasi: Post dimiliki oleh User
      Post.belongsTo(models.User, { foreignKey: 'userId' });
      // Relasi: Post memiliki banyak Comment
      Post.hasMany(models.Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
    }
  }
  Post.init({
    recipeName: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.TEXT('long'),
    privacy: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};