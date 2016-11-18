/**
 * Routes for Project endpoint
 */

const projectCtrl = require('./controller');
const { isAuthenticated } = require('../../auth/controller');

module.exports = (routes) => {
  // Project endpoints
  routes.get('/projects', projectCtrl.select);                          // Doesn't need auth
  routes.get('/projects/:id', projectCtrl.select);                      // Doesn't need auth
  routes.post('/projects', isAuthenticated, projectCtrl.upsert);        // Needs auth
  routes.put('/projects/:id', isAuthenticated, projectCtrl.upsert);     // Needs auth
  routes.delete('/projects/:id', isAuthenticated, projectCtrl.delete);  // Needs auth

  return routes;
};
