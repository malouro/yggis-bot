import { runCommand, makeMockBot } from '../../../testHelpers'

import Help from '../../../../src/commands/debug/Help'

describe('Help Command', () => {
	const HelpCommand = new Help()
	const bot = makeMockBot({ mockCommand: Help })

	describe('Main help menu', () => {
		test('returns the main help menu', async () => {
			const {
				message: {
					channel: { send: mockedSend },
				},
			} = await runCommand(HelpCommand, { args: ['!help'] })
			const mainHelpMenu = mockedSend.mock.results[0].value

			expect(mainHelpMenu).toMatchSnapshot()
		})
	})

	describe('Help Command help menu', () => {
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

		test('returns the command\'s help menu', async () => {
			expect(helpCommandHelpMenu).toMatchSnapshot()
		})

		test.each(
			HelpCommand.usage.args.map(
				arg => [arg.name, arg.description]
			),
		)(
			'the help command\'s help menu shows the `%s` argument\'s description',
			async (argName, argDescription = '') => {
				expect(helpCommandHelpMenu).toEqual(expect.stringContaining(argDescription))
			},
		)
	})

	describe('Command help menu', () => {
		test.todo(
			'displays chainable and non-chainable arguments in the command help menu'
		)
		test.todo('displays a command\'s argument usage when available')
	})

	describe('Command category help menu', () => {
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
