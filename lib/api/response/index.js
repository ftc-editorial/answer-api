const Response = require('./model');

module.exports = {
  async select(ctx, next) {
    ctx.response.body = await Response.findAll();
    console.dir(ctx.response.body);
    await next();
  },
  async insert(ctx, next) {
    await next();
  },
  async update(ctx, next) {
    await next();
  },
  async delete(ctx, next) {
    await next();
  },
};
