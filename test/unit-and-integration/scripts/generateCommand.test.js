import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import waitForExpect from 'wait-for-expect';

/** to lint the generated file */
import { CLIEngine as EslintCLIEngine } from 'eslint';
import eslintRules from '../../../.eslintrc.json';

/** to test the generated file contains the appropriate class */
import Command from '../../../src/classes/Command';

const asyncExec = promisify(exec);
const getPathToFile = fileName => path.resolve(process.cwd(), fileName);

/**
 * @func generateCommand Runs the script with arguments given
 * @param {Array} args List of CLI arguments to send
 * @param {Object: {stdout, stderror}} callback Callback function that returns the script results
 */
const generateCommand = async (args, callback) => {
	let scriptResults = null;

	try {
		scriptResults = await asyncExec(
			`node ./scripts/generate-command.js ${args.join(' ')}`
		);
	} catch (commandError) {
		return callback({ commandError });
	}

	if (callback) {
		return callback(scriptResults);
	}

	return scriptResults;
};

/**
 * @func cleanUp Cleanup a generated file after test is done
 * @param {String} fileName Name/path of file to check for and delete
 */
const cleanUp = fileName => {
	const fileToCleanUp = getPathToFile(fileName);

	// eslint-disable-next-line no-bitwise
	fs.access(fileToCleanUp, fs.constants.F_OK | fs.constants.W_OK, error => {
		// Error checking
		if (error) {
			if (error.code === 'ENOENT') {
				return 1;
			}
			throw error;
		}

		// Delete the existing generated .env file & check that it's gone
		fs.unlinkSync(fileToCleanUp);
		expect(() => fs.readFileSync(fileToCleanUp)).toThrowError();
	});

	return 0;
};

describe('generate-command', () => {
	const testDir = './test-generations/';
	const testCommandName = 'Test';
	const testOutput = `${testDir + testCommandName}.js`;
	const pathToTestDir = path.resolve(__dirname, '../../../test-generations');
	let stdOutResult = null;

	beforeAll(async () => {
		fs.stat(pathToTestDir, err => {
			if (err) {
				fs.mkdirSync(pathToTestDir);
			}
		});

		await waitForExpect(() => {
			expect(() => fs.statSync(pathToTestDir)).not.toThrow();
		});

		// Execute the generate-command script
		// Makes a dummy test command to test against
		await generateCommand(
			[
				`--outputDir="${testDir}"`,
				`--name="${testCommandName}"`,
				'--aliases alias1 alias2 alias3',
			],
			({ stdout }) => {
				stdOutResult = stdout;
			}
		);
	});

	afterAll(() => {
		cleanUp(testOutput);
	});

	test('has expected stdout on success', () => {
		expect(stdOutResult).toMatchSnapshot();
	});

	test('makes a file with expected file content', () => {
		const fileContents = fs.readFileSync(getPathToFile(testOutput), 'UTF8');

		expect(fileContents).toMatchSnapshot();
	});

	test('has a command help menu', done => {
		generateCommand(['--help'], ({ stdout }) => {
			expect(stdout).toMatchSnapshot();
			done();
		});
	});

	test('requires a name', done => {
		generateCommand([`--outputDir="${testDir}"`], ({ commandError }) => {
			expect(commandError.message).toMatch('Command failed');
			expect(commandError.message).toMatch('Missing required argument: n');
			done();
		});
	});

	test('generated file is a usable Yggis Command with given options', () => {
		// eslint-disable-next-line global-require,import/no-dynamic-require
		const TestCommandModule = require(getPathToFile(testOutput)).default;
		const CommandToTest = new TestCommandModule();

		expect(CommandToTest).toBeInstanceOf(Command);
		expect(CommandToTest.name).toBe('Test');
		expect(CommandToTest.aliases).toStrictEqual(['alias1', 'alias2', 'alias3']);
	});

	test('generated file passes linting', () => {
		const eslintEngine = new EslintCLIEngine(eslintRules);

		const results = eslintEngine.executeOnFiles([getPathToFile(testOutput)]);

		expect(results.errorCount).toBe(0);
		expect(results.warningCount).toBe(0);
	});
});
