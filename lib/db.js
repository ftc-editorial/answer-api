/**
 * DB Auth layer
 */
const { DBUSER, DBPASS, DBHOST, DBPORT, DBNAME } = process.env;

const Sequelize = require('sequelize');

const seq = new Sequelize(`postgres://${DBUSER}:${DBPASS}@${DBHOST}:${DBPORT}/${DBNAME}`);

module.exports = seq;
