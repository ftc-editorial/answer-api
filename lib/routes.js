/**
 * Application routes
 */

const { IS_DEV, GOOGLE } = require('./env');
const project = require('./api/project');
const question = require('./api/question');
const response = require('./api/response');
const User = require('./api/user/model');

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
routes.post('/projects', isAuthenticated, project.upsert);        // Needs auth
routes.put('/projects/:id', isAuthenticated, project.upsert);     // Needs auth
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
routes.prefix(''); // Login routes don't have API prefix

// This serialises the user ID value and adds to cookie
passport.serializeUser((userId, done) => {
  done(null, userId);
});

// Lookup user by ID value
// @TODO if the user changes this value in cookie, is it a PE vulnerability?
passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findById(userId);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new GoogleStrategy({
  clientID: GOOGLE.CLIENT_ID || new Error('No Client ID specified'),
  clientSecret: GOOGLE.CLIENT_SECRET || new Error('No Client Secret specified'),
  callbackURL: GOOGLE.CALLBACK || new Error('No callback URL specified'),
},
async (token, tokenSecret, profile, done) => { // This runs after oAuth dance complete
  const ftEmail = profile.emails.reduce((last, { value }) => (value.match(/ft.com$/) ? value : last), false);

  if (ftEmail) {
    const loggedIn = await User.findOrCreate({
      where: {
        googleId: profile.id, // Lookup by Google ID
      },
      defaults: {
        googleId: profile.id,
        name: profile.displayName,
        email: ftEmail,
      },
    });

    done(null, loggedIn.shift().dataValues.id);
  } else {
    done(new Error('Not a FT email')); // @TODO handle this better
  }
}));

routes.get('/auth/login', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/userinfo.email', // Needed to verify email address
  ],
}));
routes.get('/auth/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login?failureReason="Authentication failure"',
}));

// Export all routes to index.js
module.exports = routes;
