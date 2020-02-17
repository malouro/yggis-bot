import { exec } from 'child_process';
import { promisify } from 'util';

import * as sourceIndex from '../../../src';

const asyncExec = promisify(exec);

describe('NPM Module', () => {
	let cjsModule = null;
	let esmModule = null;

	beforeAll(async () => {
		await asyncExec('yarn build');

		/* eslint-disable global-require */
		cjsModule = require('../../../lib');
		esmModule = require('../../../esm');
		/* eslint-enable global-require */
	}, 20000);

	it('should be importable', () => {
		/* eslint-disable no-underscore-dangle */
		expect(cjsModule.__esModule.valueOf()).toBe(true);
		expect(esmModule.__esModule.valueOf()).toBe(true);
		/* eslint-enable no-underscore-dangle */
	});

	it('should contain all needed exports', () => {
		expect(Object.keys(cjsModule)).toStrictEqual(Object.keys(sourceIndex));
		expect(Object.keys(esmModule)).toStrictEqual(Object.keys(sourceIndex));
	});

	function checkNPMPack() {
		return asyncExec('npm pack --dry-run --json');
	}

	it('should publish with only necessary files', async () => {
		const { stdout } = await checkNPMPack();
		const [{ files }] = JSON.parse(stdout);

		files.forEach(({ path: filePath }) => {
			expect(filePath).toMatch(
				/package.json|README.*|CHANGELOG.*|LICENSE.*|lib\/.*|esm\/.*/
			);
		});
	});
});
