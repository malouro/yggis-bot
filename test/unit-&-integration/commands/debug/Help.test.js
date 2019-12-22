import { runCommand, makeMockBot } from '../../../testHelpers'

import Help from '../../../../src/commands/debug/Help'

/**
 * @todo Hit 90% coverage at least
 * @todo Write more test todo's for conditional branches
 * @todo Extrapolate common actions/tests as functions
 */

describe('Help Command', () => {
	const HelpCommand = new Help()
	const bot = makeMockBot({ mockCommand: Help })

	describe('has a main help menu', () => {
		let mockedSend = null
		let mainHelpMenu = null

		beforeEach(async () => {
			({
				message: {
					channel: { send: mockedSend },
				},
			} = await runCommand(HelpCommand, {
				args: ['!help'],
			}))

			mainHelpMenu = mockedSend.mock.results[0].value
		})

		test('that returns a string', () => expect(typeof mainHelpMenu).toBe('string'))
		test('that looks like this', () => expect(mainHelpMenu).toMatchSnapshot())
	})

	describe('has its own command help menu', () => {
		let mockedSend = null
		let helpCommandHelpMenu = null

		beforeEach(async () => {
			({
				message: {
					channel: { send: mockedSend },
				},
			} = await runCommand(HelpCommand, {
				args: ['!help', 'help'],
				bot,
			}))

			helpCommandHelpMenu = mockedSend.mock.results[0].value
		})

		test('that looks like this', () => expect(helpCommandHelpMenu).toMatchSnapshot())

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

	describe('makes a command\'s help menu', () => {
		test.todo('that displays chainable and non-chainable arguments')
		test.todo('that displays a command\'s argument usage when available')
	})

	describe('makes a command category\'s help menu', () => {
		test('returns a category\'s help menu', async () => {
			const {
				message: {
					channel: { send: mockedSend },
				},
			} = await runCommand(HelpCommand, {
				args: ['!help', 'debug'],
				bot,
			})
			const debugCategoryHelpMenu = mockedSend.mock.results[0].value

			expect(debugCategoryHelpMenu).toMatchSnapshot()
		})
	})
})
