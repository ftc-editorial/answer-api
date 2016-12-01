/**
 * Seeds the database
 */

const User = require('./api/user/model');
const Project = require('./api/project/model');
const Question = require('./api/question/model');
const Response = require('./api/response/model');

const axios = require('axios');
const { bold, underline } = require('chalk');

const testDataEndpoint = 'http://bertha.ig.ft.com/republish/publish/gss/1tOrRsPjjFO5SVvy94lGMEwDRaneK9M487ald9uwr1QI/question,project';
const testResponseCount = 10;

module.exports = async ({ force = false, log = true, useTestData = false }) => {
  let testData;

  if (useTestData) {
    const res = await axios.get(testDataEndpoint);
    testData = res.data;
  }

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
      testProject = await Project.create(testData.project.shift());
    } catch (e) {
      console.error(e);
    }
  }

  l('Seeded Project table');

  await Question.sync({ force });

  let questions;
  if (testData && testData.question.length) {
    try {
      questions = await Promise.all(testData.question.map(async (item) => {
        const newQuestion = await Question.create(item);
        newQuestion.setProject(testProject);
      }));
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
  l(underline('Database seeding complete!'));
};
