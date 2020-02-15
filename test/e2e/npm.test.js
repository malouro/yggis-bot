import * as sourceIndex from '../../src';

describe('NPM Module', () => {
	test('should be importable', () => {
		// eslint-disable-next-line global-require
		const npmModule = require('../../cjs');

		// eslint-disable-next-line no-underscore-dangle
		expect(npmModule.__esModule.valueOf()).toBe(true);
		expect(Object.keys(npmModule)).toStrictEqual(Object.keys(sourceIndex));
	});

	test.todo('should contain all needed exports');
	test.todo('');
});
