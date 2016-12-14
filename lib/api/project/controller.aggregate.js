/**
 * Aggregation function. Moved to own file to keep controller lean.
 */

const s = require('sequelize');

const Project = require('./model');
const Question = require('../question/model');
const Response = require('../response/model');

module.exports = async function getAggregate(projectId, prop, val) {
  if (prop && val) {
    try {
      const query = {
        attributes: [
          'title',
          [s.literal(`'${val}'`), prop]
        ],
        where: { id: projectId },
        include: [
          {
            model: Question,
            attributes: [
              'id',
              'text',
              'answer',
              'options',
              'meta'
            ],
            include: [
              {
                model: Response,
                attributes: {
                  include: [
                    'value',
                    'meta'
                  ]
                },
                where: {
                  meta: {
                    [prop]: val
                  }
                },
              }
            ],
          }
        ],
        group: ['project.id', 'questions.id', 'questions.responses.id']
      };

      const proj = (await Project.findOne(query));

      const results = proj ? proj.toJSON() : await (async () => {
        // Remove responses
        query.group.pop();
        query.include[0].include.pop();

        return await (await Project.findOne(query)).toJSON();
      })();

      // I wasn't able to figure out how to do this op above; ideally should be in SQL.
      results.questions = results.questions.map((item) => {
        item.text = item.text.replace(/^Q\d\.\s/, '').replace(RegExp(`\\[${prop}\\]`, 'ig'), val);
        item.responses = item.responses ? item.responses.reduce((last, curr) => {
          last[curr.value] = last[curr.value] + 1 || 1;
          return last;
        }, {}) : {};

        item.answer = item.answer[val];

        if (item.meta.median) {
          item.meta.perceived = item.meta.median[val];
        } else if (item.meta.mean) {
          item.meta.perceived = item.meta.mean[val];
        }

        return item;
      });

      return results;
    } catch (e) {
      console.error(e);
      return {};
    }
  } else {
    try {
      // Get the whole shebang; reduce to value counts.
      const results = (await Project.findOne({
        attributes: [
          'title'
        ],
        where: { id: projectId },
        include: [
          {
            model: Question,
            attributes: [
              'id',
              'text',
              'answer',
              'options',
              'meta'
            ],
            include: [
              {
                model: Response,
                attributes: [
                  'value',
                  'meta'
                ]
              }
            ],
          }
        ],
        group: ['project.id', 'questions.id', 'questions.responses.id']
      })).toJSON();

      // // I wasn't able to figure out how to do this op above; ideally should be in SQL.
      results.questions = results.questions.map((item) => {
        item.responses = item.responses.reduce((last, curr) => {
          last[curr.value] = last[curr.value] + 1 || 1;
          return last;
        }, {});

        return item;
      });

      return results;
    } catch (e) {
      console.error(e);
      return {};
    }
  }
};
