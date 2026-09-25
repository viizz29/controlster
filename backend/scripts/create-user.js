const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { DataType } = require('sequelize-typescript');
const prompt = require('prompt-sync')();

if (process.env.NODE_ENV == 'local')
  require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

// Must match the app's SnowflakeIdService (epoch 1609459200000, worker 0, seq 0)
const SNOWFLAKE_EPOCH = 1609459200000;
const EPOCH = 1609459200000;

function snowflakeId(timestamp) {
  const id = ((BigInt(timestamp - EPOCH) << 22n) | 0n).toString();
  console.log({ id });
  return id;
}

async function main() {
  const { DB_DATABASE, DB_USERNAME, DB_HOST } = process.env;

  console.log({ DB_DATABASE, DB_USERNAME, DB_HOST });

  const DB_PASSWORD = decodeURIComponent(process.env.DB_PASSWORD);

  if (!DB_DATABASE) {
    return;
  }

  const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    port: 5432,
    dialect: 'postgres',
    logging: false,
  });

  try {
    const User = sequelize.define(
      'User',
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          allowNull: false,
        },

        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },

        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        is_email_verified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },

        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },

        updated_at: {
          type: DataType.DATE,
          allowNull: false,
        },
      },
      {
        tableName: 'users',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    );

    await sequelize.authenticate();
    console.log('Connected to PostgreSQL.');

    const name = prompt('name: ');
    const email = prompt('email: ');
    const password = prompt.hide('Password: ');

    const passwordHash = await bcrypt.hash(password, 12);

    const now = new Date();

    const user = await User.create({
      id: snowflakeId(now.getTime()),
      name: name.trim(),
      email: email.trim(),
      password: passwordHash,
      is_email_verified: true,
      created_at: now,
      updated_at: now,
    });

    console.log(`User created successfully. ID: ${user.id}`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

main();
