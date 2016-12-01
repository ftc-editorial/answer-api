if (process.NODE_ENV === 'development') {
  require('dotenv').config();
}

require('./lib/env');

const seed = require('./lib/seed');

seed({ force: true, log: true, useTestData: true });
