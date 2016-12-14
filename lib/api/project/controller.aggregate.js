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

      const results = await (await Project.findOne(query)).toJSON();
      // I wasn't able to figure out how to do this op above; ideally should be in SQL.
      results.questions = results.questions.map((item) => {
        if (item.text.match(/^(Q\d{1,2})\.\s/, '')) {
          const qid = item.text.match(/^(Q\d{1,2})\.\s/, '')[1].toLowerCase();
          item.meta = item.meta || {};
          item.meta.qid = qid;
        }

        item.text = item.text.replace(/^Q\d{1,2}\.\s/, '')
          .replace(RegExp(`\\[${prop}\\]`, 'ig'), val)
          .replace(RegExp(`\\[${prop}’s\\]`, 'ig'), `${val}'s'`);

        item.responses = item.responses.reduce((last, curr) => {
          last[curr.value] = last[curr.value] + 1 || 1;
          return last;
        }, {}) || {};

        item.answer = item.answer[val];

        if (item.meta && item.meta.Median) {
          item.meta.perceived = item.meta.Median[val];
          delete item.meta.Median;
        } else if (item.meta && item.meta.Mean) {
          item.meta.perceived = item.meta.Mean[val];
          delete item.meta.Mean;
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
        if (item.text.match(/^(Q\d{1,2})\.\s/, '')) {
          const qid = item.text.match(/^(Q\d{1,2})\.\s/, '')[1].toLowerCase();
          item.meta = item.meta || {};
          item.meta.qid = qid;
        }

        item.responses = item.responses.reduce((last, curr) => {
          last[curr.value] = last[curr.value] + 1 || 1;
          return last;
        }, {}) || {};

        return item;
      });

      return results;
    } catch (e) {
      console.error(e);
      return {};
    }
  }
};
