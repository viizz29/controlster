'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'shards',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT,
          },

          host: {
            allowNull: false,
            type: Sequelize.STRING(255),
          },

          port: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },

          user_name: {
            allowNull: false,
            type: Sequelize.STRING(100),
          },

          password: {
            allowNull: false,
            type: Sequelize.STRING(255),
          },

          database: {
            allowNull: false,
            type: Sequelize.STRING(100),
          },

          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('shards', { transaction });
    });
  },
};
