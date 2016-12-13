/**
 * Controller for the Project endpoint
 */

const s = require('sequelize');

const Project = require('./model');
const Question = require('../question/model');
const Response = require('../response/model');

async function getAggregate(projectId, prop, val) {
  if (prop && val) {
    try {
      const results = (await Project.findOne({
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
            ],
            include: [
              {
                model: Response,
                attributes: {
                  include: [
                    'value',
                  ]
                },
                where: s.json(`metadata.${prop}`, val),
              }
            ],
          }
        ],
        group: ['project.id', 'questions.id', 'questions.responses.id']
      })).toJSON();

      // I wasn't able to figure out how to do this op above; ideally should be in SQL.
      results.questions = results.questions.map((item) => {
        item.responses = item.responses.reduce((last, curr) => {
          console.dir(curr);
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
            ],
            include: [
              {
                model: Response,
                attributes: [
                  'value'
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
}


module.exports = {
  async select(ctx, next) {
    try {
      if (ctx.params.id) {
        if (ctx.query.aggregate) {
          ctx.response.body = await getAggregate(ctx.params.id, ctx.query.key, ctx.query.value);
        } else {
          ctx.response.body = await Project.findOne({
            where: { id: ctx.params.id }
          });
        }
      } else {
        ctx.response.body = await Project.findAll();
      }
    } catch (e) {
      console.error(e);
    }

    next();
  },
  async create(ctx, next) {
    const body = ctx.request.body;
    try {
      ctx.response.body = await Project.create({
        title: body.title,
        description: body.description,
        enabled: body.enabled,
        owner_id: ctx.state.user,
      });
      ctx.response.status = 201;
    } catch (e) {
      console.error(e);
    }

    next();
  },
  async upsert(ctx, next) {
    const body = ctx.request.body;
    try {
      ctx.response.body = await Project.findOne({ where: { id: ctx.params.id } });

      await Project.upsert({
        id: ctx.params.id,
        title: body.title,
        description: body.description,
        enabled: body.enabled,
        owner_id: ctx.state.user,
      });

      next();
    } catch (e) {
      await next();
      console.error(e);
      ctx.response.body = e; // @TODO This might not be the best way to handle this.
    }
  },
  async delete(ctx, next) {
    try {
      if (ctx.params.id) {
        const deleted = await Project.destroy({
          where: {
            id: ctx.params.id,
          },
        });

        if (deleted) {
          ctx.response.body = `Project ID ${deleted} removed.`;
          ctx.response.status = 204;
        } else {
          ctx.response.status = 404;
        }
      }
    } catch (e) {
      console.error(e);
    }

    next();
  },
};
