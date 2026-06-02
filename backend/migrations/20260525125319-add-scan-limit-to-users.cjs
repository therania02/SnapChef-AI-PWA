'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'scanLimit', {
      type: Sequelize.INTEGER,
      defaultValue: 3, // Berikan batas default gratis per hari, misalnya 5 scan
      allowNull: false
    });
    await queryInterface.addColumn('Users', 'lastScanDate', {
      type: Sequelize.DATEONLY, // Menyimpan format YYYY-MM-DD saja
      defaultValue: Sequelize.NOW,
      allowNull: false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'scanLimit');
    await queryInterface.removeColumn('Users', 'lastScanDate');
  }
};