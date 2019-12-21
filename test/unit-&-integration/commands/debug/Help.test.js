import { runCommand } from '../../../testHelpers'

import Help from '../../../../src/commands/debug/Help'

describe('Help Command', () => {
	const HelpCommand = new Help()

	test('returns the main help menu', async () => {
		const { message: { channel: { send: mockedSend } } } = await runCommand(HelpCommand, { args: ['!help'] })

		expect(mockedSend.mock.results[0].value).toBe('This is the main help menu.')
	})

	test.todo('returns a command\'s help menu')
	test.todo('returns a category\'s help menu')
	test.todo('displays chainable and non-chainable arguments in the command help menu')
	test.todo('displays a command\'s argument usage when available')
})
