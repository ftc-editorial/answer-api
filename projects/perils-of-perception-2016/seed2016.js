/**
 * Perils of Perception 2016 data seeder
 */

const Project = require('../../lib/api/project/model');
const Question = require('../../lib/api/question/model');
const Response = require('../../lib/api/response/model');

const BATCH_2622312_DATA = require('././Batch_2622312_batch_results.json');
const SURVEY_QUESTIONS = require('./import-ipsos-2016')();

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
            defaults: q,
          })
          .spread(i => i))
        .setProject(p)
      )
    );

    return BATCH_2622312_DATA.filter(r => !r.reject).map(async r => await Promise.all(
      qs.map(async (q) => {
        const qNum = q.text.match(/Q(\d{1,2})\.\s/)[1];
        let i;
        switch (qNum) {
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
            i = qNum;
            break;
          case '10':
            i = '9';
            break;
          case '12':
            i = '11';
            break;
          case '14':
            i = '13';
            break;
          case '16':
            i = '15';
            break;
          default:
            i = false;
            break;
        }

        if (!i) return;

        await (await Response.findCreateFind({
          where: {
            'meta.HITId': r.HITId,
            questionId: q.id,
          },
          defaults: {
            value: r.Answer[`q${i}`],
            submitted: new Date('2016-12-09T00:00:00'),
            meta: r,
          },
        }).spread(inst => inst)).setQuestion(q);
      })));
  } catch (e) {
    console.error(e);
  }
};
