import { runCommand } from '../../../testHelpers'

import Ping from '../../../../src/commands/debug/Ping'

describe('Ping Command', () => {
	const PingCommand = new Ping()

	test('returns a message with a ping', async () => {
		const expectedPing = 420
		const result = await runCommand(PingCommand, {
			client: { ping: expectedPing },
		})

		expect(result.message.reply).toHaveReturnedWith(
			`Pong! \`${expectedPing} ms\``,
		)
	})

	test('rounds the given ping', async () => {
		const result1 = await runCommand(PingCommand, { client: { ping: 0.69 } })
		const result2 = await runCommand(PingCommand, { client: { ping: 0.42 } })

		expect(result1.message.reply).toHaveNthReturnedWith(1, expect.stringContaining('`1 ms`'))
		expect(result2.message.reply).toHaveNthReturnedWith(2, expect.stringContaining('`0 ms`'))
	})
})
