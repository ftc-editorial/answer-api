/**
 * FT Answers Backend
 */

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config(); // eslint-disable-line global-require
}

const ENV = require('./env');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const convert = require('koa-convert');
const session = require('koa-generic-session');
const passport = require('koa-passport');

if (ENV.SEED_DB) require('./seed')({ force: true, log: false }); // eslint-disable-line global-require

const app = new Koa();
const router = require('./routes');

// Body Parser
app.use(bodyParser());

// Passport
app.keys = [ENV.APP_SECRET];
app.use(convert(session()));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(router.routes())
  .use(router.allowedMethods());

// Start it up
app.listen(ENV.PORT);

module.exports = app;
