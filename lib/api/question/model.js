/**
 * Model for the Question table
 */

const db = require('../../db');
const Response = require('../response/model');
const S = require('sequelize');

const Question = db.define('question', {
  text: S.STRING,
  answer: {
    type: S.JSONB,
    allowNull: true, // Allow survey questions
  },
  options: {
    type: S.ARRAY(S.STRING),
    allowNull: true,
  },
});

Question.hasMany(Response);

module.exports = Question;
