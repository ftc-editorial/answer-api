/**
 * Application routes
 */

const Router = require('koa-router');

const routes = new Router({
  prefix: '/api/v1', // All v1 API endpoints prefixed with "/api/v1"
});

require('./api/project')(routes);
require('./api/question')(routes);
require('./api/response')(routes);

// Handle Google 2-legged oAuth (v2)
routes.prefix(''); // Login routes don't have API prefix
require('./auth')(routes);

// Export all routes to index.js
module.exports = routes;
