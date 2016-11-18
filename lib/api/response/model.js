const db = require('../../db');
const S = require('sequelize');

const Response = db.define('response', {
  value: S.JSONB,
});

module.exports = Response;
