/**
 * Model for the Question table
 */

const S = require('sequelize');
const db = require('../../db');
const Response = require('../response/model');

const Question = db.define('question', {
  text: S.STRING,
  answer: {
    type: S.JSONB,
    allowNull: true, // Allow survey questions
  },
  options: {
    type: S.JSONB,
    allowNull: true,
  },
  meta: {
    type: S.JSONB,
    allowNull: true,
  }
});

Question.hasMany(Response);
Response.belongsTo(Question);

module.exports = Question;
