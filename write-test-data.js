#!/usr/local/env node
const seed = require('./lib/seed');

seed({ force: true, log: true, useTestData: false });
