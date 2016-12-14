/**
 * Perils of Perception 2016 data seeder
 */

const Project = require('../../lib/api/project/model');
const Question = require('../../lib/api/question/model');

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

    return await Promise.all(
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
  } catch (e) {
    console.error(e);
  }
};
