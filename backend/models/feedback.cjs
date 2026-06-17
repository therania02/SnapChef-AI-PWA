'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Feedback extends Model {
        static associate(models) {
            Feedback.belongsTo(models.User, {
                foreignKey: 'userId'
            });
        }
    }

    Feedback.init({
        userId: DataTypes.INTEGER,
        rating: DataTypes.INTEGER,
        category: DataTypes.STRING,
        feedback: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Feedback',
        tableName: 'feedbacks'
    });

    return Feedback;
};