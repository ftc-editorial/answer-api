if (process.env.NODE_ENV === 'dev') {
  require('dotenv').config(); // eslint-disable-line global-require
}
const { DBUSER, DBPASS, DBHOST, DBPORT, DBNAME } = process.env;

const Sequelize = require('sequelize');

const seq = new Sequelize(`postgres://${DBUSER}:${DBPASS}@${DBHOST}:${DBPORT}/${DBNAME}`);

module.exports = seq;
