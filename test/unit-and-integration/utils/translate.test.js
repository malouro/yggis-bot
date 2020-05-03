import mockConsole from 'jest-mock-console';

import translate from '../../../src/utils/i18n/translate';
import { MissingI18nConfigError } from '../../../src/utils/errors';

const testTranslations = {
	test: {
		COMMON: {
			someSubspace: {
				keyWithinSubspace: 'Key within a subspace',
				functionWithinSubspace: jest.fn(
					val => `Function within a subspace called with ${val}`
				),
			},
			keyWithinSpace: 'Key within a space',
			functionWithinSpace: jest.fn(
				val => `Function within a space called with ${val}`
			),
		},
		UNCOMMON: {
			someSubspace: {
				keyWithinSubspace: 'ULTRA-RARE Key within a subspace',
				functionWithinSubspace: jest.fn(val => `SECRET-RARE ${val}`),
			},
			keyWithinSpace: 'RARE Key within a space',
			functionWithinSpace: jest.fn(val => `SUPER-RARE ${val}`),
		},
	},
};

describe('Translate', () => {
	let t = null;

	beforeAll(() => {
		t = translate({
			defaultSpace: 'COMMON',
			translations: testTranslations,
			language: Object.keys(testTranslations)[0],
		});
	});

	test('creates a translation function', () => {
		expect(t).toBeInstanceOf(Function);
	});

	test('provides translated text when supplied with matching arguments/keys', () => {
		expect(t('COMMON', 'someSubspace', 'keyWithinSubspace')).toMatchSnapshot(
			'COMMON.someSubspace.keyWithinSubspace'
		);
		expect(t('COMMON', null, 'keyWithinSpace')).toMatchSnapshot(
			'COMMON.keyWithinSpace'
		);
		expect(t('UNCOMMON', 'someSubspace', 'keyWithinSubspace')).toMatchSnapshot(
			'UNCOMMON.someSubspace.keyWithinSubspace'
		);
		expect(t('UNCOMMON', null, 'keyWithinSpace')).toMatchSnapshot(
			'UNCOMMON.keyWithinSpace'
		);
	});

	test('runs any functions and return values when they are called via the translation function', () => {
		const test1 = t(
			'COMMON',
			'someSubspace',
			'functionWithinSubspace'
		)('TEST-1');
		const test2 = t('COMMON', null, 'functionWithinSpace')('TEST-2');
		const test3 = t(
			'UNCOMMON',
			'someSubspace',
			'functionWithinSubspace'
		)('TEST-3');
		const test4 = t('UNCOMMON', null, 'functionWithinSpace')('TEST-4');

		expect(testTranslations.test.COMMON.functionWithinSpace).toHaveBeenCalled();
		expect(
			testTranslations.test.COMMON.someSubspace.functionWithinSubspace
		).toHaveBeenCalled();
		expect(
			testTranslations.test.UNCOMMON.functionWithinSpace
		).toHaveBeenCalled();
		expect(
			testTranslations.test.UNCOMMON.someSubspace.functionWithinSubspace
		).toHaveBeenCalled();

		expect(test1).toMatchSnapshot('Function within subspace, in default space');
		expect(test2).toMatchSnapshot('Function within default space');
		expect(test3).toMatchSnapshot(
			'Function within subspace, in non-default space'
		);
		expect(test4).toMatchSnapshot('Function within non-default space');
	});

	describe('Error handling', () => {
		test("should throw MissingI18nConfigError when translations aren't provided", () => {
			expect(() => translate({ language: 'test' })).toThrowError(
				MissingI18nConfigError
			);
		});

		test("should throw MissingI18nConfigError when language isn't provided", () => {
			expect(() => translate({ translations: {} })).toThrowError(
				MissingI18nConfigError
			);
		});

		test('should throw console error when [x][y][z] is missing from translations', () => {
			const restoreConsole = mockConsole();

			const result1 = t('SOMEWHAT-COMMON', 'someSubspace', 'keyWithinSubSpace');
			const result2 = t(
				'COMMON',
				'someNonExistentSubspace',
				'keyWithinSubSpace'
			);
			const result3 = t('COMMON', 'someSubspace', 'nonExistentKey');

			/* eslint-disable no-console */
			expect(console.error).toHaveBeenCalledTimes(2);
			expect(console.error).toHaveBeenNthCalledWith(1, expect.any(Error));
			expect(console.error).toHaveBeenNthCalledWith(2, expect.any(Error));
			/* eslint-enable no-console */

			expect(result1).toBeNull();
			expect(result2).toBeNull();
			expect(result3).toBeUndefined();

			restoreConsole();
		});
	});
});
