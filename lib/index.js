/**
 * FT Answers Backend
 */

const ENV = require('./env');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const convert = require('koa-convert');
const session = require('koa-generic-session');
const passport = require('koa-passport');
const cors = require('kcors');

if (ENV.SEED_DB) require('./seed')({ force: false, log: true, useTestData: ENV.TEST_DATA }); // eslint-disable-line global-require

const app = new Koa();
const router = require('./routes');

// Body Parser
app.use(bodyParser());

// CORS
app.use(cors());

// Passport
app.keys = [ENV.APP_SECRET];
app.use(convert(session()));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(router.routes())
  .use(router.allowedMethods());

// Start it up
app.listen(ENV.PORT, () => console.info(`Listening on port ${ENV.PORT}`));

module.exports = app;
