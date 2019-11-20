import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import waitForExpect from 'wait-for-expect'

import Command from '../../../src/classes/Command'

const asyncExec = promisify(exec)
const getPathToFile = fileName => path.resolve(process.cwd(), fileName)

/**
 * @func generateCommand Runs the script with arguments given
 * @param {Array} args List of CLI arguments to send
 * @param {Object: {stdout, stderror}} callback Callback function that returns the script results
 */
const generateCommand = async (args, callback) => {
	let scriptResults = null

	try {
		scriptResults = await asyncExec(
			'node ./scripts/generate-command.js '
			+ `${args.join(' ')}`,
		)
	} catch (commandError) {
		return callback({ commandError })
	}

	if (callback) {
		return callback(scriptResults)
	}

	return scriptResults
}

/**
 * @func cleanUp Cleanup a generated file after test is done
 * @param {String} fileName Name/path of file to check for and delete
 */
const cleanUp = async (fileName) => {
	const fileToCleanUp = getPathToFile(fileName)

	// eslint-disable-next-line no-bitwise
	fs.access(fileToCleanUp, fs.constants.F_OK | fs.constants.W_OK, (error) => {
		// Error checking
		if (error) {
			if (error.code === 'ENOENT') {
				return 1
			}
			throw error
		}

		// Delete the existing generated .env file & check that it's gone
		fs.unlinkSync(fileToCleanUp)
		expect(() => fs.readFileSync(fileToCleanUp)).toThrowError()
	})

	return 0
}

describe('generate-command', () => {
	const testDir = './test-generations/'
	const pathToTestDir = path.resolve(__dirname, '../../../test-generations')

	beforeAll(async () => {
		fs.stat(pathToTestDir, (err) => {
			if (err) {
				fs.mkdirSync(pathToTestDir)
			}
		})

		await waitForExpect(() => {
			expect(() => fs.statSync(pathToTestDir)).not.toThrow()
		})
	})

	test('makes a command with given options', async () => {
		const testCommandName = 'Test'
		const testOutput = `${testDir + testCommandName}.js`

		await generateCommand([
			`--outputDir="${testDir}"`,
			`--name="${testCommandName}"`,
			'--aliases alias1 alias2 alias3',
		], ({ stdout }) => {
			expect(stdout).toMatchSnapshot('stdout')
		})

		const fileContents = fs.readFileSync(getPathToFile(testOutput), 'UTF8')

		expect(fileContents).toMatchSnapshot('File content')

		await cleanUp(testOutput)
	})

	test('has a command help menu', (done) => {
		generateCommand([
			'--help',
		], ({ stdout }) => {
			expect(stdout).toMatchSnapshot()
			done()
		})
	})

	test('requires a name', (done) => {
		generateCommand([
			`--outputDir="${testDir}"`,
		], ({ commandError }) => {
			expect(commandError.message).toMatch('Command failed')
			expect(commandError.message).toMatch('Missing required argument: n')
			done()
		})
	})

	test('generated file is a usable Yggis Command', async () => {
		const testCommandName = 'TestUsable'
		const testOutput = `${testDir + testCommandName}.js`

		await generateCommand([
			`--outputDir="${testDir}"`,
			`--name="${testCommandName}"`,
			'--aliases alias1 alias2 alias3',
		])

		expect(fs.statSync(getPathToFile(testOutput))).toBeTruthy()

		// eslint-disable-next-line global-require,import/no-dynamic-require
		const CommandToTest = require(getPathToFile(testOutput)).default

		expect(new CommandToTest()).toBeInstanceOf(Command)

		await cleanUp(testOutput)
	})
})
