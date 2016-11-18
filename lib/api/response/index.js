/**
 * Routes for Question endpoint
 */
const responseCtrl = require('./controller');
const { isAuthenticated } = require('../../auth/controller');

module.exports = (routes) => {
  // Response endpoints
  routes.get('/response', isAuthenticated, responseCtrl.select);        // Needs auth
  routes.get('/response/:id', isAuthenticated, responseCtrl.select);    // Needs auth
  routes.post('/response', responseCtrl.insert);                        // Doesn't need auth
};
