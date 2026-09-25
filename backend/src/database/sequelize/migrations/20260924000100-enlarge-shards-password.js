'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'shards',
        'password',
        {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        { transaction },
      );
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'shards',
        'password',
        {
          allowNull: false,
          type: Sequelize.STRING(255),
        },
        { transaction },
      );
    });
  },
};
