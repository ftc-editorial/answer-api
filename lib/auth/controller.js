const { IS_DEV } = require('../env');

exports.isAuthenticated = (ctx, next) => {
  if (IS_DEV ||
    (ctx.isAuthenticated() && !!~ctx.state.user.email.indexOf('@ft.com'))) return next();
  else ctx.throw('User is not authenticated', 401);
};
