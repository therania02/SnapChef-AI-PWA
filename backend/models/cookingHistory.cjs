'use strict';

module.exports = (sequelize, DataTypes) => {

    const CookingHistory = sequelize.define(
        'CookingHistory',
        {
            recipeName: {
                type: DataTypes.STRING,
                allowNull: false
            },

            ingredients: {
                type: DataTypes.JSON
            },

            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }
    );

    CookingHistory.associate = (models) => {

        CookingHistory.belongsTo(
            models.User,
            {
                foreignKey: "userId"
            }
        );

    };

    return CookingHistory;
};