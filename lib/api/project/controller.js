/**
 * Controller for the Project endpoint
 */

const Project = require('./model');

module.exports = {
  async select(ctx, next) {
    try {
      if (ctx.params.id) {
        const response = await Project.findOne({ where: { id: ctx.params.id } });
        const questions = await response.getQuestions();
        const result = response.toJSON();
        result.questions = questions;

        ctx.response.body = result;
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
