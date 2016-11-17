const User = require('./api/user/model');
const Project = require('./api/project/model');
const Question = require('./api/question/model');
const Response = require('./api/response/model');

/* eslint-disable no-console */
(async () => {
  console.info('Commencing database seeding...');

  await User.sync({ force: true });
  await User.create({
    googleId: '0001',
    name: 'Ædmin',
    email: 'aendrew@aendrew.com',
  });
  console.log('Seeded User table');

  await Project.sync({ force: true });
  console.log('Seeded Project table');

  await Question.sync({ force: true });
  console.log('Seeded Question table');

  await Response.sync({ force: true });
  console.log('Seeded Response table');

  console.info('Database seeding complete!');
})();
/* eslint-enable no-console */
