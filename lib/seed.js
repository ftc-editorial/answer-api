/**
 * Seeds the database
 */

const User = require('./api/user/model');
const Project = require('./api/project/model');
const Question = require('./api/question/model');
const Response = require('./api/response/model');
const { bold, underline } = require('chalk');

const l = log => console.info(bold(log));

module.exports = async (forceBool = false) => {
  /* eslint-disable no-console */
  l(underline('Commencing database seeding...'));

  await User.sync({ force: forceBool });
  await User.create({
    googleId: '0001',
    name: 'Ædmin',
    email: 'aendrew@aendrew.com',
  });

  l('Seeded User table');

  await Project.sync({ force: forceBool });

  l('Seeded Project table');

  await Question.sync({ force: forceBool });

  l('Seeded Question table');

  await Response.sync({ force: forceBool });

  l('Seeded Response table');
  l(underline('Database seeding complete!'));
};
