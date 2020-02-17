// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	clearMocks: true,
	collectCoverageFrom: [
		'<rootDir>/src/**/*.{js,ts,jsx,tsx}',
		'!<rootDir>/src/utils/logger.js',
		'!<rootDir>/src/Yggis.js',
		'!**/index.js',
	],
	coverageDirectory: 'coverage',
	coverageThreshold: {
		global: {
			branches: 90,
			functions: 90,
			lines: 90,
			statements: 90,
		},
	},
	watchPathIgnorePatterns: ['<rootDir>/test-generations/.*'],
	setupFiles: ['<rootDir>/test/setupMocks'],
	testEnvironment: 'node',
	testMatch: ['<rootDir>/test/unit-and-integration/**/*.test.js?(x)'],
	testPathIgnorePatterns: ['node_modules'],
};
