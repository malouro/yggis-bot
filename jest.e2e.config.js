const path = require('path');
const { config } = require('dotenv');

const baseJestConfig = require('./jest.config');

config({ path: path.resolve(__dirname, '../../.env.test') });

require('dotenv').config({
	path: '.env.test',
});

module.exports = Object.assign(baseJestConfig, {
	setupFiles: ['<rootDir>/test/setupE2E'],
	testMatch: ['<rootDir>/test/e2e/**/*.test.{t,j}s?(x)'],
});
