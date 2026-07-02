'use strict';

const path = require('path');

require('dotenv').config();

const makeConfig = (database, defaults = {}) => ({
  username: process.env.DB_USERNAME || process.env.DB_USER || defaults.username || 'root',
  password: process.env.DB_PASSWORD ?? defaults.password ?? null,
  database: process.env.DB_DATABASE || process.env.DB_NAME || database,
  host: process.env.DB_HOST || defaults.host || '127.0.0.1',
  port: Number(process.env.DB_PORT || defaults.port || 3306),
  dialect: 'mysql',
});

module.exports = {
  development: makeConfig('snapchef_db'),
  test: makeConfig('database_test'),
  production: makeConfig('database_production'),
};
