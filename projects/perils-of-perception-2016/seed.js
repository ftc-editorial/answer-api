/**
 * Perils of Perception 2016 data seeder
 */

const Project = require('../../lib/api/project/model');
const Question = require('../../lib/api/question/model');
const Response = require('../../lib/api/response/model');

const BATCH_2622312_DATA = require('././Batch_2622312_batch_results.json');
const SURVEY_QUESTIONS = require('./questions-2015.json');

module.exports = async function seedPerils() {
  try {
    const p = await Project.findCreateFind({
      where: {
        title: 'Perils of Perception survey 2016',
      },
      defaults: {
        title: 'Perils of Perception survey 2016',
        description: 'Project by David Blood and Ændrew Rininsland',
        enabled: true,
      },
    }).spread(i => i);

    const qs = await Promise.all(
      SURVEY_QUESTIONS.map(async q => await (
          await Question.findCreateFind({
            where: {
              text: q.text,
              projectId: p.id,
            },
            defaults: {
              text: q.text,
              answer: q.answer,
            },
          })
          .spread(i => i))
        .setProject(p)
      )
    );

    await BATCH_2622312_DATA.filter(r => !r.reject).map(async r => await Promise.all(
      qs.map(async (q, i) => await (await Response.findCreateFind({
        where: {
          'metadata.HITId': r.HITId,
          questionId: q.id,
        },
        defaults: {
          value: r.Answer[`q${i + 1}`],
          submitted: new Date('2016-12-09T00:00:00'),
          metadata: r,
        },
      }).spread(inst => inst)).setQuestion(q))));
  } catch (e) {
    console.error(e);
  }
};
