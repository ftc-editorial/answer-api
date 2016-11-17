/**
 * DB Auth layer
 */
const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = require('./env').DB;

const Sequelize = require('sequelize');

const seq = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

module.exports = seq;
