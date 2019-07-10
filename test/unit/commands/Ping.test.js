import Ping from '../../../src/commands/debug/Ping'

import { runCommand } from './commandTestHelpers'

describe('Ping Command', () => {
	const PingCommand = new Ping()

	const MockMessageReply = jest.fn(message => message)
	const MockLogger = jest.fn(options => options)
	const MockRunOptions = {
		client: {
			ping: 420,
		},
		message: {
			reply: MockMessageReply,
		},
		logger: { debug: { log: MockLogger } },
	}

	test('should return a message with a ping', async () => {
		await runCommand(PingCommand, MockRunOptions)

		expect(MockMessageReply).toHaveReturnedWith(`Pong! \`${MockRunOptions.client.ping} ms\``)
	})

	test('should round the given ping correctly', async () => {
		await runCommand(PingCommand, MockRunOptions, { client: { ping: 0.69 } })
		await runCommand(PingCommand, MockRunOptions, { client: { ping: 0.420 } })

		expect(MockMessageReply).toHaveNthReturnedWith(1, 'Pong! `1 ms`')
		expect(MockMessageReply).toHaveNthReturnedWith(2, 'Pong! `0 ms`')
	})
})
