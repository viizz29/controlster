'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'password_reset_tokens',
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
          token: {
            type: Sequelize.STRING(255),
            allowNull: false,
            unique: true,
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

      await queryInterface.addIndex('password_reset_tokens', ['token'], {
        transaction,
      });

      await queryInterface.addConstraint('password_reset_tokens', {
        type: 'primary key',
        fields: ['user_id', 'sn'],
        name: 'pk_password_reset_tokens',
        transaction,
      });

      await queryInterface.addColumn(
        'users',
        'next_password_reset_token_sn',
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
        CREATE OR REPLACE FUNCTION generate_next_password_reset_token_sn() RETURNS TRIGGER AS $$
        DECLARE
          next_sn BIGINT;
        BEGIN
          -- Fetch the next_sn from the users table where id = NEW.user_id
          SELECT next_password_reset_token_sn INTO next_sn FROM users WHERE id = NEW.user_id FOR UPDATE;
    
          NEW.sn := next_sn;
    
          UPDATE users SET next_password_reset_token_sn = next_password_reset_token_sn + 1 where id = NEW.user_id;
    
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `,
        { transaction },
      );

      // Create the trigger
      await queryInterface.sequelize.query(
        `
        CREATE TRIGGER password_reset_tokens_before_insert_generate_sn
        BEFORE INSERT ON "password_reset_tokens"
        FOR EACH ROW
        EXECUTE FUNCTION generate_next_password_reset_token_sn();
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
    DROP TRIGGER IF EXISTS password_reset_tokens_before_insert_generate_sn ON "password_reset_tokens";
  `,
        { transaction },
      );

      // Drop the trigger function
      await queryInterface.sequelize.query(
        `
    DROP FUNCTION IF EXISTS generate_next_password_reset_token_sn();
  `,
        { transaction },
      );

      await queryInterface.removeColumn(
        'users',
        'next_password_reset_token_sn',
        {
          transaction,
        },
      );

      // Drop the table (this automatically removes constraints)
      await queryInterface.dropTable('password_reset_tokens', { transaction });
    });
  },
};
