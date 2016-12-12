const db = require('../../db');
const S = require('sequelize');

const Response = db.define('response', {
  value: S.JSONB,
  submitted: S.DATE,
  metadata: S.JSONB,
});

module.exports = Response;
