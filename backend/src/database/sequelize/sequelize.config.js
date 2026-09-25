// src/database/sequelize.config.js

if(process.env.NODE_ENV == 'local')
  require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

// console.log(process.env.DB_PASSWORD);
const PASS = decodeURIComponent(process.env.DB_PASSWORD);

module.exports = {
  username: process.env.DB_USERNAME,
  password: PASS,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: 'postgres',
};
