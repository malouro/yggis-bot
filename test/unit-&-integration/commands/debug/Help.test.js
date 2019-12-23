import { runCommand, makeMockBot } from '../../../testHelpers'

import Help from '../../../../src/commands/debug/Help'

/**
 * @todo Hit 90% coverage at least
 * @todo Write more test todo's for conditional branches
 * @todo Extrapolate common actions/tests as functions
 */

describe('Help Command', () => {
	const mockBot = makeMockBot({ mockCommand: Help })
	const HelpCommand = new Help()

	/**
	 * @description
	 * - Runs the help command given option overrides
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
	})

	describe('makes a command\'s help menu', () => {
		test.todo('that displays chainable and non-chainable arguments')
		test.todo('that displays a command\'s argument usage when available')
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

	describe('makes a command category\'s help menu', () => {
		let debugCategoryHelpMenu = null

		beforeAll(async () => {
			debugCategoryHelpMenu = await runHelpCommand({ args: ['!help', 'debug'] })
		})

		test('that displays a category\'s help menu', () => {
			expect(debugCategoryHelpMenu).toEqual(expect.stringMatching('`debug`'))
			expect(debugCategoryHelpMenu).toMatchSnapshot()
		})

		test.todo('with chainable arguments displayed')
		test.todo('with non-chainable arguments displayed')
		test.todo('with both chainable & non-chainable arguments displayed')
	})
})
