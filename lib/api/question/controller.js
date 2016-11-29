const Question = require('./model');
const Project = require('../project/model');

module.exports = {
  async select(ctx, next) {
    try {
      if (ctx.params.id) {
        ctx.response.body = await Question.findOne({ where: { id: ctx.params.id } });
      } else {
        ctx.response.body = await Question.findAll();
      }
    } catch (e) {
      console.error(e);
    }

    next();
  },
  async create(ctx, next) {
    const body = ctx.request.body;
    try {
      const parentProject = await Project.findOne({ where: { id: body.projectId } });
      const newQuestion = await Question.create({
        text: body.text,
        answer: body.answer,
        options: body.options,
      });
      newQuestion.setProject(parentProject);

      ctx.response.body = newQuestion;
      ctx.response.status = 201;
    } catch (e) {
      console.error(e);
    }

    next();
  },
  async upsert(ctx, next) {
    const body = ctx.request.body;
    try {
      ctx.response.body = await Question.findOne({ where: { id: ctx.params.id } });

      await Question.upsert({
        id: ctx.params.id,
        text: body.text,
        answer: body.answer,
        options: body.options,
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
        const deleted = await Question.destroy({
          where: {
            id: ctx.params.id,
          },
        });

        if (deleted) {
          ctx.response.body = `Question ID ${deleted} removed.`;
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
