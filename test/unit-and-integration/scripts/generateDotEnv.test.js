import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const asyncExec = promisify(exec)
const getPathToFile = fileName => path.resolve(process.cwd(), fileName)

/**
 * @func generateDotEnv Runs the script with arguments given
 * @param {Array} args List of CLI arguments to send
 * @param {Object: {stdout, stderror}} callback Callback function that returns the script results
 */
const generateDotEnv = async (args, callback) => {
	let scriptResults = null

	try {
		scriptResults = await asyncExec(
			'node ./scripts/generate-dotenv.js '
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

describe('generate-dotenv', () => {
	test('makes a .env file with given options', async () => {
		const testOutput = './testEnvFile'

		await generateDotEnv([
			`--outputFile="${testOutput}"`,
			'--token="TestToken"',
			'--userID="TestUserID"',
			'--guildID="TestGuildID"',
		], ({ stdout }) => {
			expect(stdout).toMatchSnapshot('stdout')
		})

		const fileContents = fs.readFileSync(getPathToFile(testOutput), 'UTF8')

		expect(fileContents).toMatchSnapshot('File content')

		await cleanUp(testOutput)
	})

	test('has a command help menu', (done) => {
		generateDotEnv([
			'--help',
		], ({ stdout }) => {
			expect(stdout).toMatchSnapshot()
			done()
		})
	})

	test('requires a token', (done) => {
		generateDotEnv([
			'--userID="TestUserID"',
			'--guildID="TestGuildID"',
		], ({ commandError }) => {
			expect(commandError.message).toMatch('Command failed')
			expect(commandError.message).toMatch('Missing required argument: t')
			done()
		})
	})
})
