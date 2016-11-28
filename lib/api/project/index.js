/**
 * Routes for Project endpoint
 */

const projectCtrl = require('./controller');
const { isAuthenticated } = require('../../auth/controller');

module.exports = (routes) => {
  // Project endpoints
  routes.get('/project', projectCtrl.select);                          // Doesn't need auth
  routes.get('/project/:id', projectCtrl.select);                      // Doesn't need auth
  routes.post('/project', isAuthenticated, projectCtrl.create);        // Needs auth
  routes.put('/project/:id', isAuthenticated, projectCtrl.upsert);     // Needs auth
  routes.delete('/project/:id', isAuthenticated, projectCtrl.delete);  // Needs auth

  return routes;
};
