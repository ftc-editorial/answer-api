exports = {
  async select(ctx, next) {
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
