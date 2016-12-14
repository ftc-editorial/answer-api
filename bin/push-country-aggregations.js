#!/usr/local/env node

const { S3 } = require('aws-sdk');
const { slugify } = require('voca');

const getAggregate = require('../lib/api/project/controller.aggregate');
const Project = require('../lib/api/project/model');

const s3 = new S3({
  accessKeyId: process.env.AWS_KEY_PROD,
  secretAccessKey: process.env.AWS_SECRET_PROD,
});

async function getCountries() {
  const projects = await Promise.all((await Project.findAll({})).map(async (p) => {
    const questions = (await p.getQuestions()).map(q => q.toJSON());
    const pJSON = p.toJSON();
    pJSON.questions = questions;
    return pJSON;
  }));
  return projects.map(d => ({
    id: d.id,
    title: d.title,
    countries: Object.keys(d.questions[0].answer),
  }));
}


getCountries().then((projects) => {
  projects.forEach((p) => {
    p.countries.forEach(async (c) => {
      const agg = await getAggregate(p.id, 'Country', c);
      const prefix = `v1/ft-interactive/answer-api/${p.id}/`;
      const Key = `${prefix}${p.id}__${slugify(p.title)}__${slugify(c)}.json`;
      s3.putObject({
        Bucket: process.env.BUCKET_NAME_PROD,
        Key,
        ACL: 'public-read',
        Body: JSON.stringify(agg),
      }, (err, res) => {
        console.dir(res);
        console.log(err);
      });
    });
  });
});
