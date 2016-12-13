const Response = require('./model');
const Question = require('../question/model');

module.exports = {
  async select(ctx, next) {
    try {
      if (ctx.params.id) {
        ctx.response.body = await Response.findOne({ where: { id: ctx.params.id } });
      } else {
        ctx.response.body = await Response.findAll();
      }
    } catch (e) {
      console.error(e);
    }

    next();
  },
  async create(ctx, next) {
    const body = ctx.request.body;

    try {
      const parentQuestion = await Question.findOne({ where: { id: body.questionId } });
      const newResponse = await Response.create({
        submitted: new Date(),
        value: body.value,
        meta: body.meta,
      });
      newResponse.setQuestion(parentQuestion);

      ctx.response.body = newResponse;
      ctx.response.status = 201;
    } catch (e) {
      console.error(e);
    }

    next();
  },
  /**
   * This isn't currently attached to any endpoint in the router.
   */
  async delete(ctx, next) {
    try {
      if (ctx.params.id) {
        const deleted = await Response.destroy({
          where: {
            id: ctx.params.id,
          },
        });

        if (deleted) {
          ctx.response.body = `Response ID ${deleted} removed.`;
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
