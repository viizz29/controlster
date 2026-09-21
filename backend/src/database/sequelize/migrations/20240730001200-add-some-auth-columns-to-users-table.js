'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'users',
        'role',
        {
          type: Sequelize.STRING(50),
          allowNull: false,
          defaultValue: 'user',
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'users',
        'is_email_verified',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'users',
        'email_verification_token',
        {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'users',
        'email_verification_token_expires_at',
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'users',
        'is_2fa_enabled',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'users',
        'is_email_notifications_enabled',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        { transaction },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('users', 'role', {
        transaction,
      });
      await queryInterface.removeColumn('users', 'is_email_verified', {
        transaction,
      });
      await queryInterface.removeColumn('users', 'email_verification_token', {
        transaction,
      });
      await queryInterface.removeColumn(
        'users',
        'email_verification_token_expires_at',
        { transaction },
      );

      await queryInterface.removeColumn('users', 'is_2fa_enabled', {
        transaction,
      });

      await queryInterface.removeColumn(
        'users',
        'is_email_notifications_enabled',
        {
          transaction,
        },
      );
    });
  },
};
