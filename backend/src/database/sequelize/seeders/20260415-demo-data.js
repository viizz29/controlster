'use strict';

// Must match the app's SnowflakeIdService (epoch 1609459200000, worker 0, seq 0)
const SNOWFLAKE_EPOCH = 1609459200000;
const EPOCH = 1609459200000;

function snowflakeId(timestamp) {
  const id = ((BigInt(timestamp - EPOCH) << 22n) | 0n).toString();
  console.log({ id });
  return id;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.sequelize.transaction(async (transaction) => {
      // Step 1: Create 5 users with explicit snowflake ids
      const users = Array.from({ length: 5 }).map((_, i) => ({
        id: snowflakeId(now.getTime() + i),
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password:
          '$2b$10$KiAcpDEwGrA9eZoqouDRz.do8oWxu7brPs.Py7WbQl9cX/CDTtWD6', // password123
        is_email_verified: true,
        created_at: now,
        updated_at: now,
      }));

      // Insert users
      await queryInterface.bulkInsert('users', users, { transaction });

      // Step 2: Fetch inserted users (to get IDs)
      const insertedUsers = await queryInterface.sequelize.query(
        `SELECT id, name FROM "users";`,
        { type: Sequelize.QueryTypes.SELECT, transaction },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Then delete users
      await queryInterface.bulkDelete('users', null, {});
    });
  },
};
