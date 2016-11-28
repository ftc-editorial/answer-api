const db = require('../../db');
const Question = require('../question/model');
const S = require('sequelize');

const Project = db.define('project', {
  title: S.STRING,
  description: S.STRING,
  enabled: S.BOOLEAN,
});

Project.hasMany(Question);
Question.belongsTo(Project);

module.exports = Project;
