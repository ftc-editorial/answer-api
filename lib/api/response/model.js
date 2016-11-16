const db = require('../../db');
const Question = require('../question/model');
const S = require('sequelize');

const Response = db.define('response', {
  value: S.JSONB,
  question_id: {
    type: S.INTEGER,
    references: {
      model: Question,
      key: 'id',
    },
  },
});

exports = Response;
