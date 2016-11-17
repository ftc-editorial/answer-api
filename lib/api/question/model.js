/**
 * Model for the Question table
 */

const db = require('../../db');
const Project = require('../project/model');
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

Question.belongsTo(Project);

module.exports = Question;
