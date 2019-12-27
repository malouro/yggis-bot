import Help from '../../../../src/commands/debug/Help'
import {
	runCommand,
	makeMockBot,
	MockConfig,
	makeMockCommand,
} from '../../../testHelpers'
import { makeCommandFromModule } from '../../../../src/utils/commands'
import { getCommands } from '../../../../src/utils/setup'

describe('Help Command', () => {
	const mockBot = makeMockBot({ mockCommand: Help })
	const HelpCommand = new Help()

	/**
	 * @description
	 * - Runs the Help command, with a given set of option overrides
	 * - Use an array for `args` to list out arguments to be used in the command execution
	*/
	const runHelpCommand = async ({
		args = ['!help'],
		bot = mockBot,
		...options
	} = {}) => {
		const {
			message: {
				channel: { send: mockedSend },
			},
		} = await runCommand(HelpCommand, {
			args,
			bot,
			...options,
		})

		return mockedSend.mock.results[0].value
	}

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('makes a main help menu', () => {
		let mainHelpMenu = null

		beforeAll(async () => {
			mainHelpMenu = await runHelpCommand()
		})

		test('that returns a string', () => {
			expect(typeof mainHelpMenu).toBe('string')
		})

		test('that looks like this', () => {
			expect(mainHelpMenu).toMatchSnapshot()
		})

		test('when invalid usage is given', async () => {
			const invalidUsageHelpMenu = await runHelpCommand({ args: ['!help', 'invalid'] })

			expect(invalidUsageHelpMenu).toMatchSnapshot()
		})
	})

	describe('makes a command\'s help menu', () => {
		const makeArg = (number, chainable = false, usage = null) => ({
			name: `arg${number}`,
			description: `Arg#${number}`,
			chainable,
			usage,
		})

		const commandWithSomeArgs = makeMockCommand({
			name: 'Command',
			usage: {
				args: [
					makeArg(1, true), makeArg(2, false), { name: 'arg3' }
				]
			}
		})
		const commandWithChainArgs = makeMockCommand({
			name: 'Chain',
			usage: {
				args: [
					makeArg(1, true), makeArg(2, true)
				]
			}
		})
		const commandWithNonChainArgs = makeMockCommand({
			name: 'NonChain',
			usage: {
				args: [
					makeArg(1, false), makeArg(2, false)
				]
			}
		})
		const commandWithBoth = makeMockCommand({
			name: 'Both',
			usage: {
				args: [
					makeArg(1, true), makeArg(2, false),
				]
			}
		})
		const commandWithArgUsage = makeMockCommand({
			name: 'ArgUsage',
			usage: {
				args: [
					makeArg(1, true, 'Use this like that.'),
					makeArg(2, false, 'Use that like this.'),
				]
			}
		})

		const bot = makeMockBot({
			commands: getCommands([
				makeCommandFromModule(Help),
				makeCommandFromModule(commandWithSomeArgs),
				makeCommandFromModule(commandWithChainArgs),
				makeCommandFromModule(commandWithNonChainArgs),
				makeCommandFromModule(commandWithBoth),
				makeCommandFromModule(commandWithArgUsage),
			])
		})

		const chainArgRegex = /\([\w,\s]+\)/
		const nonChainArgRegex = /<[\w|]+>/

		test('that displays a command\'s available arguments', async () => {
			const commandWithSomeArgsResult = await runHelpCommand({ bot, args: ['!help', 'command'] })

			expect(commandWithSomeArgsResult).toEqual(expect.stringContaining('Command'))
			expect(commandWithSomeArgsResult).toEqual(expect.stringContaining('!command'))
			expect(commandWithSomeArgsResult).toEqual(expect.stringContaining('`<arg2|arg3>` `(arg1)`'))
			expect(commandWithSomeArgsResult).toEqual(expect.stringContaining('`arg3`\n(Missing description.)'))

			expect(commandWithSomeArgsResult).toMatchSnapshot()
		})

		test('that displays an argument\'s usage details when available', async () => {
			const argUsageResult = await runHelpCommand({ bot, args: ['!help', 'argusage'] })

			expect(argUsageResult).toMatchSnapshot()
		})

		test('with chainable arguments displayed', async () => {
			const chainableArgsResult = await runHelpCommand({ bot, args: ['!help', 'chain'] })

			expect(chainableArgsResult).toEqual(expect.stringMatching(chainArgRegex))
			expect(chainableArgsResult).not.toEqual(expect.stringMatching(nonChainArgRegex))
		})

		test('with non-chainable arguments displayed', async () => {
			const nonChainableArgsResult = await runHelpCommand({ bot, args: ['!help', 'nonchain'] })

			expect(nonChainableArgsResult).toEqual(expect.stringMatching(nonChainArgRegex))
			expect(nonChainableArgsResult).not.toEqual(expect.stringMatching(chainArgRegex))
		})

		test('with both chainable & non-chainable arguments displayed', async () => {
			const bothArgTypesResult = await runHelpCommand({ bot, args: ['!help', 'both'] })

			expect(bothArgTypesResult).toEqual(expect.stringMatching(chainArgRegex))
			expect(bothArgTypesResult).toEqual(expect.stringMatching(nonChainArgRegex))
		})
	})

	describe('makes a command category\'s help menu', () => {
		test('with or without command category configuration', async () => {
			const testCommand = makeMockCommand({
				name: 'TestCommand',
				category: 'test'
			})
			const noCategoryConfigCommand = makeMockCommand({
				name: 'NoCatConfigCommand',
				category: 'no-cat'
			})

			const commands = getCommands([
				makeCommandFromModule(testCommand),
				makeCommandFromModule(noCategoryConfigCommand)
			])

			const bot = makeMockBot({
				commands,
				config: {
					...MockConfig,
					commandPrefix: '!',
					commandCategories: {
						test: {
							name: 'Test',
							description: 'Testing command categories',
						}
					}
				}
			})

			const testCategoryHelpMenu = await runHelpCommand({
				args: ['!help', 'test'],
				bot,
			})

			jest.clearAllMocks()

			const noCategoryConfigHelpMenu = await runHelpCommand({
				args: ['!help', 'no-cat'],
				bot,
			})

			expect(testCategoryHelpMenu).toMatchSnapshot('should have a category description')
			expect(noCategoryConfigHelpMenu).toMatchSnapshot('should not have a category description, and the name is generated')
		})
	})

	describe('has its own command help menu', () => {
		let helpCommandHelpMenu = null

		beforeAll(async () => {
			helpCommandHelpMenu = await runHelpCommand({ args: ['!help', 'help'] })
		})

		test('that looks like this', () => {
			expect(helpCommandHelpMenu).toMatchSnapshot()
		})

		test.each(
			HelpCommand.usage.args.map(
				arg => [arg.name, arg.description]
			),
		)(
			'that shows the `%s` argument\'s description',
			(argName, argDescription = '') =>
				expect(helpCommandHelpMenu).toEqual(expect.stringContaining(argDescription))
		)
	})

	describe('has its own command category help menu (for the `debug` category)', () => {
		let debugCategoryHelpMenu = null

		beforeAll(async () => {
			debugCategoryHelpMenu = await runHelpCommand({ args: ['!help', 'debug'] })
		})

		test('that looks like this', () => {
			expect(debugCategoryHelpMenu).toMatchSnapshot()
		})
	})
})
