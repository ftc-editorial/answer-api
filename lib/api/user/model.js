const db = require('../../db');
const S = require('sequelize');
const Project = require('../project/model');

const User = db.define('user', {
  googleId: S.STRING, // @TODO Does it makes sense to make this the PK?
  name: S.STRING,
  email: S.STRING,
});

User.hasMany(Project);

module.exports = User;
