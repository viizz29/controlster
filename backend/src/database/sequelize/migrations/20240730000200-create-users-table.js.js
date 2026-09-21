'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'users',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.BIGINT,
          },

          email: {
            allowNull: true,
            type: Sequelize.STRING(50),
            unique: true,
          },

          name: {
            allowNull: true,
            type: Sequelize.STRING(60),
            defaultValue: '',
          },

          password: {
            allowNull: false,
            type: Sequelize.STRING(100),
          },

          is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: false,
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
      await queryInterface.dropTable('users', { transaction });
    });
  },
};
