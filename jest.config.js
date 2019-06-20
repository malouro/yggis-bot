// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	clearMocks: true,
	coverageDirectory: 'coverage',
	setupFiles: [
		'<rootDir>/test/setup/setupMocks',
		'<rootDir>/test/setup/setupE2E',
	],
	testEnvironment: 'node',
	testMatch: [
		'<rootDir>/test/**/*.test.js?(x)',
	],
	testPathIgnorePatterns: [
		'node_modules',
	],
}
