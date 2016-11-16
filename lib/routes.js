/**
 * Application routes
 */

const { IS_DEV, GOOGLE } = require('./env');
const project = require('./api/project');
const question = require('./api/question');
const response = require('./api/response');

const Router = require('koa-router');
const passport = require('koa-passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const isAuthenticated = (ctx, next) => {
  if (IS_DEV ||
    (ctx.isAuthenticated() && !!~ctx.state.user.email.indexOf('@ft.com'))) return next();
  else ctx.throw('User is not authenticated', 401);
};

const routes = new Router({
  prefix: '/api/v1', // All v1 API endpoints prefixed with "/api/v1"
});

// Project endpoints
routes.get('/projects', project.select);                          // Doesn't need auth
routes.get('/projects/:id', project.select);                      // Doesn't need auth
routes.post('/projects', isAuthenticated, project.insert);        // Needs auth
routes.put('/projects/:id', isAuthenticated, project.update);     // Needs auth
routes.delete('/projects/:id', isAuthenticated, project.delete);  // Needs auth

// Question endpoints
routes.get('/question', question.select);                         // Doesn't need auth
routes.get('/question/:id', question.select);                     // Doesn't need auth
routes.post('/question', isAuthenticated, question.insert);       // Needs auth
routes.put('/question/:id', isAuthenticated, question.update);    // Needs auth
routes.delete('/question/:id', isAuthenticated, question.delete); // Needs auth

// Response endpoints
routes.get('/response', isAuthenticated, response.select);        // Needs auth
routes.get('/response/:id', isAuthenticated, response.select);    // Needs auth
routes.post('/response', response.insert);                        // Doesn't need auth

// Handle Google 2-legged oAuth (v2)
passport.use(
  new GoogleStrategy({
    clientId: GOOGLE.CLIENT_ID || new Error('No Client ID specified'),
    clientSecret: GOOGLE.CLIENT_SECRET || new Error('No Client Secret specified'),
    callbackURL: GOOGLE.CALLBACK || new Error('No callback URL specified'),
  },
  (token, tokenSecret, profile, done) => {
    // retrieve user ...
    done(null, profile);
  }),
);

routes.get('/auth/login', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login'], // @TODO Does G+ work in this context?
}));
routes.get('/auth/login/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login',
}));

// Export all routes to index.js
exports = routes;
