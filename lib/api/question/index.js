/**
 * Routes for Question endpoint
 */
const questionCtrl = require('./controller');
const { isAuthenticated } = require('../../auth/controller');

module.exports = (routes) => {
  // Question endpoints
  routes.get('/question', questionCtrl.select);                         // Doesn't need auth
  routes.get('/question/:id', questionCtrl.select);                     // Doesn't need auth
  routes.post('/question', isAuthenticated, questionCtrl.create);       // Needs auth
  routes.put('/question/:id', isAuthenticated, questionCtrl.upsert);    // Needs auth
  routes.delete('/question/:id', isAuthenticated, questionCtrl.delete); // Needs auth

  return routes;
};
