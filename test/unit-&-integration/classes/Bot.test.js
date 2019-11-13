import { Collection } from 'discord.js'
import { Bot } from '../../../src/classes'
import {
	MockBot,
	MockConfig,
	MockClient,
	MockToken,
	MockLogger,
} from '../../testHelpers'

describe('Bot Class', () => {
	test('constructs a Bot', () => {
		const testBot = new Bot({
			config: MockConfig,
			token: MockToken,
		})

		expect(testBot).toBeInstanceOf(Bot)
		expect(testBot.config).toMatchObject(MockConfig)
		expect(testBot.token).toBe(MockToken)
	})

	test('sets activity, based on config, when `onReady` is fired', async () => {
		const customClient = MockClient

		customClient.user = {
			setActivity: jest.fn(),
		}

		const testBot = new Bot({
			client: customClient,
			config: MockConfig,
			logger: MockLogger,
			token: MockToken,
		})

		testBot.client.emit('ready')

		expect(customClient.user.setActivity).toHaveBeenCalledWith(
			MockConfig.statusMessage,
			MockConfig.statusMessageOptions,
		)
	})

	test('handles incoming messages', async () => {
		const testBot = MockBot

		await testBot.client.emit('message', {
			content: 'Test Message',
		})

		expect(MockLogger.bot.log).toHaveBeenCalledWith({
			level: 'info',
			message: 'Message received: "Test Message"',
		})
	})

	test('handles messages that start with the commandPrefix as a command', () => {
		const mockCommands = new Collection()
		const mockTestCommand = { run: jest.fn() }

		mockCommands.set('test', mockTestCommand)

		const testBot = new Bot({
			client: MockClient,
			commands: mockCommands,
			config: MockConfig,
			logger: MockLogger,
		})

		testBot.onMessage({
			content: `${MockConfig.commandPrefix}test Message`,
		})

		expect(mockTestCommand.run).toHaveBeenCalledWith(
			expect.objectContaining({
				message: { content: `${MockConfig.commandPrefix}test Message` },
			}),
		)
	})
})
