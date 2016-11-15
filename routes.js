/**
 * Application routes
 */

const Router = require('koa-router');
const project = require('./api/project');

const routes = new Router({
  prefix: '/api/v1',
});

routes.get('/projects', project.select);
routes.get('/projects/:id', project.select);
routes.post('/projects', project.insert);
routes.put('/projects/:id', project.update);
routes.delete('/projects:id', project.delete);

module.exports = routes;
