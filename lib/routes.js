/**
 * Application routes
 */

const Router = require('koa-router');
const project = require('./api/project');
const passport = require('koa-passport');

const routes = new Router({
  prefix: '/api/v1',
});

routes.get('/projects', project.select);
routes.get('/projects/:id', project.select);
routes.post('/projects', project.insert);
routes.put('/projects/:id', project.update);
routes.delete('/projects:id', project.delete);

routes.get('/auth/login', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login',
}));

module.exports = routes;
