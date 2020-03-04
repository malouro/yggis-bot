import { Collection } from 'discord.js';
import { Bot } from '../../../src/classes';
import {
	MockBot,
	MockDefaultConfig,
	MockClient,
	MockToken,
	MockLogger,
	MockCommand,
	makeMockCommand,
} from '../../testHelpers';
import { MissingTokenError } from '../../../src/utils/errors';

describe('Bot Class', () => {
	describe('Functionality', () => {
		test('constructs a Bot', () => {
			const testBot = new Bot({
				name: 'TestBot',
				token: MockToken,
				...MockDefaultConfig,
			});

			expect(testBot).toBeInstanceOf(Bot);
			expect(testBot.name).toBe('TestBot');
			expect(testBot).toMatchObject(MockDefaultConfig);
			expect(testBot.token).toBe(MockToken);
		});

		test('sets activity, based on config, when `onReady` is fired', () => {
			const customClient = MockClient;

			customClient.user = {
				setActivity: jest.fn(),
			};

			const testBot = new Bot({
				client: customClient,
				logger: MockLogger,
				token: MockToken,
				...MockDefaultConfig,
			});

			testBot.client.emit('ready');

			expect(customClient.user.setActivity).toHaveBeenCalledWith(
				MockDefaultConfig.statusMessage,
				MockDefaultConfig.statusMessageOptions
			);
		});

		test('handles incoming messages', async () => {
			const testBot = MockBot;

			await testBot.client.emit('message', {
				author: { bot: false },
				content: 'Test Message',
			});

			expect(MockLogger.bot.log).toHaveBeenCalledWith({
				level: 'info',
				message: 'Message received: "Test Message"',
			});
		});

		test('ignores messages from bots', () => {
			process.env.NODE_ENV = 'production';

			const testBot = MockBot;

			testBot.client.emit('message', {
				author: { bot: true },
				content: 'Test Message',
			});

			expect(MockLogger.bot.log).not.toHaveBeenCalled();

			process.env.NODE_ENV = 'test';
		});

		test('handles messages that start with the commandPrefix as a command', () => {
			const mockCommands = new Collection();
			const mockTestCommand = new MockCommand();

			mockTestCommand.run = jest.fn();
			mockCommands.set('test', mockTestCommand);

			const testBot = new Bot({
				client: MockClient,
				commands: mockCommands,
				logger: MockLogger,
				...MockDefaultConfig,
			});

			testBot.onMessage({
				author: { bot: false },
				content: `${MockDefaultConfig.commandPrefix}test Message`,
			});

			expect(mockTestCommand.run).toHaveBeenCalledWith(
				expect.objectContaining({
					message: expect.objectContaining({
						content: `${MockDefaultConfig.commandPrefix}test Message`,
					}),
				})
			);
		});

		test.each([
			['A', 'a capital letter'],
			['$', 'a symbol that\'s not a "!"'],
			['Ç', 'a non-typical letter symbol'],
			['1,000.000', 'a long number'],
		])('can handle %s (%s) as the commandPrefix', commandPrefix => {
			const mockCommands = new Collection();
			const mockTestCommand = new MockCommand();

			mockTestCommand.run = jest.fn();
			mockCommands.set('test', mockTestCommand);

			const testBot = new Bot({
				client: MockClient,
				commands: mockCommands,
				logger: MockLogger,
				...MockDefaultConfig,
				commandPrefix,
			});

			testBot.onMessage({
				author: { bot: false },
				content: `${commandPrefix}test Message`,
			});

			expect(mockTestCommand.run).toHaveBeenCalled();
		});

		test('sorts given commands alphabetically', () => {
			const commands = [
				makeMockCommand({ name: 'alpha' }),
				makeMockCommand({ name: 'omega' }),
				makeMockCommand({ name: '123' }),
				makeMockCommand({ name: 'æ' }),
				makeMockCommand({ name: 'zeta' }),
			];
			const mockCommands = new Collection(
				commands.map(Command => [Command.name, new Command()])
			);

			const testBot = new Bot({
				commands: mockCommands,
				...MockDefaultConfig,
			});

			expect(Array.from(testBot.commands.keys())).toStrictEqual([
				'123',
				'alpha',
				'omega',
				'zeta',
				'æ',
			]);
		});

		test('sets a command categories list when given commands that are configured with command categories', () => {
			const mockCommands = new Collection();

			mockCommands.set('commandA', { name: 'commandA', category: 'cat1' });
			mockCommands.set('commandB', { name: 'commandB', category: 'cat1' });
			mockCommands.set('commandC', { name: 'commandC', category: 'cat2' });

			const testBot = new Bot({
				commands: mockCommands,
			});

			/* eslint-disable no-underscore-dangle */
			expect(Array.from(testBot._commandCategories.keys())).toStrictEqual([
				'cat1',
				'cat2',
			]);
			expect(testBot._commandCategories.get('cat1')).toMatchObject({
				/* cspell: disable-next-line */
				commands: expect.arrayContaining(['commanda', 'commandb']),
			});
			expect(testBot._commandCategories.get('cat2')).toMatchObject({
				/* cspell: disable-next-line */
				commands: expect.arrayContaining(['commandc']),
			});
			/* eslint-enable no-underscore-dangle */
		});

		test('has an empty command category list when no commands are supplied', () => {
			const testBot = new Bot({
				commands: new Collection(),
			});

			/* eslint-disable-next-line no-underscore-dangle */
			expect(Array.from(testBot._commandCategories.keys())).toStrictEqual([]);
		});
	});

	describe('Error handling', () => {
		test('throws error when a token is not given', () => {
			const oldToken = process.env.TOKEN;

			delete process.env.TOKEN;

			expect(() => new Bot({ token: null })).toThrowError(
				new MissingTokenError('Missing or invalid `token` in config!')
			);

			process.env.TOKEN = oldToken;
		});
	});
});
