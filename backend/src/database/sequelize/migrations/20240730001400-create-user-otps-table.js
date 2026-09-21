'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'user_otps',
        {
          user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          sn: {
            type: Sequelize.BIGINT,
            allowNull: false,
          },
          otp: {
            type: Sequelize.STRING(6),
            allowNull: false,
          },
          type: {
            type: Sequelize.STRING(50),
            allowNull: false,
            defaultValue: 'login_2fa',
          },
          expires_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          used_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        },
        { transaction },
      );

      await queryInterface.addIndex('user_otps', ['user_id', 'type'], {
        transaction,
      });

      await queryInterface.addConstraint('user_otps', {
        type: 'primary key',
        fields: ['user_id', 'sn'],
        name: 'pk_user_otps',
        transaction,
      });

      await queryInterface.addColumn(
        'users',
        'next_user_otp_sn',
        {
          allowNull: false,
          type: Sequelize.BIGINT,
          defaultValue: 1,
        },
        { transaction },
      );

      // create trigger for generating ids, sequentially
      await queryInterface.sequelize.query(
        `
        CREATE OR REPLACE FUNCTION generate_next_user_otp_sn() RETURNS TRIGGER AS $$
        DECLARE
          next_sn BIGINT;
        BEGIN
          -- Fetch the next_sn from the users table where id = NEW.user_id
          SELECT next_user_otp_sn INTO next_sn FROM users WHERE id = NEW.user_id FOR UPDATE;
    
          NEW.sn := next_sn;
    
          UPDATE users SET next_user_otp_sn = next_user_otp_sn + 1 where id = NEW.user_id;
    
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `,
        { transaction },
      );

      // Create the trigger
      await queryInterface.sequelize.query(
        `
        CREATE TRIGGER user_otps_before_insert_generate_sn
        BEFORE INSERT ON "user_otps"
        FOR EACH ROW
        EXECUTE FUNCTION generate_next_user_otp_sn();
      `,
        { transaction },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Drop the trigger
      await queryInterface.sequelize.query(
        `
    DROP TRIGGER IF EXISTS user_otps_before_insert_generate_sn ON "user_otps";
  `,
        { transaction },
      );

      // Drop the trigger function
      await queryInterface.sequelize.query(
        `
    DROP FUNCTION IF EXISTS generate_next_user_otp_sn();
  `,
        { transaction },
      );

      await queryInterface.removeColumn('users', 'next_user_otp_sn', {
        transaction,
      });

      // Drop the table (this automatically removes constraints)
      await queryInterface.dropTable('user_otps', { transaction });
    });
  },
};
