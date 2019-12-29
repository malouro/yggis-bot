import { Collection } from 'discord.js'
import { Bot } from '../../../src/classes'
import {
	MockBot,
	MockConfig,
	MockClient,
	MockToken,
	MockLogger,
	MockCommand,
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
			author: { bot: false },
			content: 'Test Message',
		})

		expect(MockLogger.bot.log).toHaveBeenCalledWith({
			level: 'info',
			message: 'Message received: "Test Message"',
		})
	})

	test('ignores messages from bots', async () => {
		process.env.NODE_ENV = 'production'

		const testBot = MockBot

		await testBot.client.emit('message', {
			author: { bot: true },
			content: 'Test Message',
		})

		expect(MockLogger.bot.log).not.toHaveBeenCalled()

		process.env.NODE_ENV = 'test'
	})

	test('handles messages that start with the commandPrefix as a command', () => {
		const mockCommands = new Collection()
		const mockTestCommand = new MockCommand()

		mockTestCommand.run = jest.fn()
		mockCommands.set('test', mockTestCommand)

		const testBot = new Bot({
			client: MockClient,
			commands: mockCommands,
			config: MockConfig,
			logger: MockLogger,
		})

		testBot.onMessage({
			author: { bot: false },
			content: `${MockConfig.commandPrefix}test Message`,
		})

		expect(mockTestCommand.run).toHaveBeenCalledWith(
			expect.objectContaining({
				message: expect.objectContaining({
					content: `${MockConfig.commandPrefix}test Message`
				}),
			})
		)
	})

	test.each([
		['A', 'a capital letter'],
		['$', 'a symbol that\'s not a "!"'],
		['Ç', 'a non-typical letter symbol'],
		['1,000.000', 'a long number'],
	])(
		'can handle %s (%s) as the commandPrefix',
		(commandPrefix) => {
			const mockCommands = new Collection()
			const mockTestCommand = new MockCommand()

			mockTestCommand.run = jest.fn()
			mockCommands.set('test', mockTestCommand)

			const testBot = new Bot({
				client: MockClient,
				commands: mockCommands,
				config: {
					...MockConfig,
					commandPrefix
				},
				logger: MockLogger
			})

			testBot.onMessage({
				author: { bot: false },
				content: `${commandPrefix}test Message`,
			})

			expect(mockTestCommand.run).toHaveBeenCalled()
		},
	)

	test('sets a command commandCategories list given commands that are configured with commandCategories', () => {
		const mockCommands = new Collection()

		mockCommands.set('commandA', { name: 'commandA', category: 'cat1' })
		mockCommands.set('commandB', { name: 'commandB', category: 'cat1' })
		mockCommands.set('commandC', { name: 'commandC', category: 'cat2' })

		const testBot = new Bot({
			commands: mockCommands,
		})

		expect(Array.from(testBot.commandCategories.keys())).toStrictEqual([
			'cat1',
			'cat2',
		])
		expect(testBot.commandCategories.get('cat1')).toMatchObject({
			commands: expect.arrayContaining(['commanda', 'commandb']),
		})
		expect(testBot.commandCategories.get('cat2')).toMatchObject({
			commands: expect.arrayContaining(['commandc']),
		})
	})

	test('has an empty command category list when no commands are supplied', () => {
		const testBot = new Bot({
			commands: new Collection(),
		})

		expect(Array.from(testBot.commandCategories.keys())).toStrictEqual([])
	})
})
