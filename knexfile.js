// @ts-check

const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const migrations = {
  directory: path.join(__dirname, 'server', 'migrations'),
};

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite',
    },
    debug: true,
    useNullAsDefault: true,
    migrations,
  },

  test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations,
  },

  production: {
    client: process.env.DB_TYPE,
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    },
    useNullAsDefault: true,
    migrations,
  },
};
