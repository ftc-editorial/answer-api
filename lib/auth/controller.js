const { IS_DEV, IS_TEST } = require('../env');

exports.isAuthenticated = (ctx, next) => {
  if (IS_DEV || IS_TEST ||
    (ctx.isAuthenticated() && !!~ctx.state.user.email.indexOf('@ft.com'))) return next();
  else ctx.throw('User is not authenticated', 401);
};
