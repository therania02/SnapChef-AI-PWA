'use strict';

module.exports = {

    async up(queryInterface, Sequelize) {

        await queryInterface.createTable(
            'CookingHistories',
            {

                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },

                recipeName: {
                    type: Sequelize.STRING
                },

                ingredients: {
                    type: Sequelize.JSON
                },

                userId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                },

                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                },

                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                }

            }
        );

    },

    async down(queryInterface) {

        await queryInterface.dropTable(
            'CookingHistories'
        );

    }

};