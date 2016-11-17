/**
 * FT Answers Backend
 */

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config(); // eslint-disable-line global-require

  if (process.env.SEED_DB) {
    require('./seed'); // eslint-disable-line
  }
}

const ENV = require('./env');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const convert = require('koa-convert');
const session = require('koa-generic-session');
const passport = require('koa-passport');

const app = new Koa();

const router = require('./routes');

// Body Parser
app.use(bodyParser());

// Passport
app.keys = [process.env.APP_SECRET || 'secret'];
app.use(convert(session()));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(router.routes())
  .use(router.allowedMethods());

// Start it up
app.listen(ENV.PORT);
