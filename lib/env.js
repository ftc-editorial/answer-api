/**
 * Random environment stuff
 */

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config(); // eslint-disable-line global-require
}

const IS_DEV = exports.IS_DEV = process.env.NODE_ENV === 'development';
const HOSTNAME = exports.HOSTNAME = IS_DEV ? 'localhost' : (process.env.HOSTNAME || 'localhost');
const PORT = exports.PORT = process.env.PORT || 5353;

exports.GOOGLE = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  CALLBACK: process.env.GOOGLE_CALLBACK || `http://${HOSTNAME}:${PORT}/auth/callback`,
};

exports.DB = {
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME || 'answerapi',
};

exports.SEED_DB = process.env.USE_TEST_DATA === 'true';
exports.NODE_DEBUG = process.env.NODE_DEBUG !== 'false' ? process.env.NODE_DEBUG : false;

exports.APP_SECRET = process.env.APP_SECRET || 'plschangethispls';

exports.TEST_DATA = process.env.USE_TEST_DATA === 'true';
