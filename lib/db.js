/**
 * DB Auth layer
 */
const ENV = require('./env');
const { dim } = require('chalk');

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = ENV.DB;

const Sequelize = require('sequelize');

const seq = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  logging: (log) => {
    if (process.env.NODE_ENV === 'development') {
      if (ENV.NODE_DEBUG) {
        console.info(dim(log));
      }
    } else {
      console.info(dim(log));
    }
  },
});

module.exports = seq;
