#!/usr/local/env node
const seed = require('../lib/seed'); // eslint-disable-line global-require

seed({
  force: true,
  log: true,
  useTestData: false,
  seedProjects: true
});
