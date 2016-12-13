/**
 * Seeds the database
 */

const User = require('./api/user/model');
const Project = require('./api/project/model');
const Question = require('./api/question/model');
const Response = require('./api/response/model');
const { resolve } = require('path');

const axios = require('axios');
const { bold, underline } = require('chalk');
const glob = require('glob');

const testDataEndpoint = 'http://bertha.ig.ft.com/republish/publish/gss/1tOrRsPjjFO5SVvy94lGMEwDRaneK9M487ald9uwr1QI/question,project';
const testResponseCount = 10;

async function seedAllProjects(seed = false) {
  if (!seed) return;
  const files = glob.sync(`${resolve(__dirname, '..')}/projects/**/seed.js`);

  try {
    // If you can't tell from the number of eslint overrides, the following line isn't a great idea.
    await Promise.all(files.map(async file => await require(file)())); // eslint-disable-line global-require,import/no-dynamic-require,max-len
  } catch (e) {
    console.error(e);
  }
}

module.exports = async ({ force = false, log = true, useTestData = false, seedProjects = false }) => {
  const testData = useTestData ? (await axios.get(testDataEndpoint)).data : undefined;

  /* eslint-disable no-console */
  const l = msg => (log ? console.info(bold(msg)) : '');
  l(underline('Commencing database seeding...'));

  await User.sync({ force });
  await User.create({
    googleId: '0001',
    name: 'Ædmin',
    email: 'aendrew@aendrew.com',
  });

  l('Seeded User table');

  await Project.sync({ force });

  let testProject;
  if (testData && testData.project.length) {
    try {
      const testProjectData = testData.project.shift();
      testProject = await Project.findCreateFind({
        where: {
          id: testProjectData.id,
        },
        defaults: testProjectData,
      }).spread(i => i);
    } catch (e) {
      console.error(e);
    }
  }

  l('Seeded Project table');

  await Question.sync({ force });

  let questions;
  if (testData && testData.question.length) {
    try {
      questions = await Promise.all(testData.question.map(async item =>
        await (await Question.create(item)).setProject(testProject)
      ));
    } catch (e) {
      console.error(e);
    }
  }

  l('Seeded Question table');

  await Response.sync({ force });

  if (testData && !testData.response) {
    try {
      await Promise.all(
        questions.map(async item => new Array(testResponseCount).map(
          async () => await Response.create({
            values: {
              chosen: (Math.random() * (item['1'] - item['0'])) + item['0'],
              country: item.country,
            },
          }))));
    } catch (e) {
      console.error(e);
    }
  }

  l('Seeded Response table');

  l('Seeding pre-configured projects');
  await seedAllProjects(seedProjects);

  l(underline('Database seeding complete!'));
};
