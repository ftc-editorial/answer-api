const { GOOGLE } = require('../env');

const passport = require('koa-passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../api/user/model');

module.exports = (routes) => {
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
};
