/**
 * Controller for the Project endpoint
 */

const Project = require('./model');

module.exports = {
  async select(ctx, next) {
    try {
      ctx.response.body = await Project.findAll({
        where: {
          id: ctx.params.id || undefined,
        },
      });
    } catch (e) {
      console.error(e);
    }

    next();
  },
  async upsert(ctx, next) {
    const body = ctx.request.body;
    try {
      ctx.response.body = await Project.upsert({
        id: ctx.params.id || undefined,
        title: body.title,
        description: body.description,
        enabled: body.enabled,
        owner_id: ctx.state.user,
      });
    } catch (e) {
      console.error(e);
    }

    next();
  },
  async delete(ctx, next) {
    try {
      if (ctx.params.id) {
        const deleted = await Project.destroy({
          where: {
            id: ctx.params.id,
          },
        });

        ctx.response.body = deleted ? `Project ID ${deleted} removed.` : new Error('Unable to delete');
      }
    } catch (e) {
      console.error(e);
    }

    next();
  },
};
