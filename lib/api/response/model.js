const db = require('../../db');
const Question = require('../question/model');
const S = require('sequelize');

const Response = db.define('response', {
  value: S.JSONB,
});

Response.belongsTo(Question);

module.exports = Response;
