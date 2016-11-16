const db = require('../../db');
const User = require('../user/model');
const S = require('sequelize');

const Project = db.define('project', {
  title: S.STRING,
  description: S.STRING,
  enabled: S.BOOLEAN,
  owner_id: {
    type: S.STRING,
    references: {
      model: User,
      key: 'id',
    },
  },
});

module.exports = Project;
