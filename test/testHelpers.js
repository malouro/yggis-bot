// eslint-disable-next-line no-unused-vars
import { Collection, Client, GuildMember } from 'discord.js';
import { EventEmitter } from 'events';

import Bot from '../src/classes/Bot';
import Command from '../src/classes/Command';

import { loggerNames } from '../src/utils/logger';
import { translate } from '../src/utils/i18n';
import defaultTranslations from '../i18n/en-US';

/**
 * @description
 * - Constant values that are used during or before test setup
 * - Typically this means mock environment variables
 */
export * from './testConstants';

/**
 * @description
 * - A mock of the config to use for the test bot.
 * - Follows the template of default values defined in `/src/constants/config.js`
 */
export const MockDefaultConfig = {
	commandCategories: {},
	commandPrefix: 'testPrefix',
	statusMessage: 'testStatusMessage',
	statusMessageOptions: {
		type: 'statusMessageType',
		url: 'statusMessageUrl',
	},
	language: 'test',
	translations: {
		test: defaultTranslations,
	},
};

/**
 * @type {GuildMember}
 *
 * @description
 * A basic mock of a Discord.js GuildMember
 */
export const MockMember = {
	hasPermission: () => false,
	id: 'NotTheMaster :(',
	guild: { owner: { id: 'NotTheOwner :(' } },
};

/**
 * @type {EventEmitter}
 *
 * @description
 * A basic mock of a Discord.js Client
 */
export const MockClient = new EventEmitter();

/**
 * @type {{ [key: string]: { log: jest.fn } }}
 */
const MockLogger = {};

loggerNames.forEach(type => {
	MockLogger[type] = {
		log: jest.fn(logMessage => logMessage),
	};
});
export { MockLogger };

/**
 * @todo <Write JS Docs>
 * @param {*} param0
 */
export function MockTranslateFunc(
	{ defaultSpace, language, translations } = {
		defaultSpace: 'COMMON',
		language: 'test',
		translations: {
			test: defaultTranslations,
		},
	}
) {
	return translate({
		defaultSpace,
		language,
		translations,
	});
}

/**
 * @type {Command}
 *
 * @description
 * A basic mock command to run tests with or on.
 */
export class MockCommand extends Command {
	constructor() {
		super({
			name: 'Test',
		});
	}
}

/**
 * @param {Object} options - List of options to configure the mock command with
 *
 * @description
 * - This will make a command with the Command class defined in `/src/classes/`.
 * - The key name of the command class (and property of `name`) will default to 'MockCommand'.
 */
export const makeMockCommand = ({
	name = 'MockCommand',
	t = MockTranslateFunc,
	...otherOptions
}) =>
	({
		[name]: class extends Command {
			constructor() {
				super({
					name,
					...otherOptions,
				});
				this.t = t;
			}
		},
	}[name]);

/**
 * @type {Collection<String, Command>}
 *
 * @description
 * Uses the `getCommands` utility function to make a collection containing mock command(s)
 */
export const MockCommandList = [MockCommand];

/**
 * @description
 * Default options to initialize the test bot with.
 */
export const defaultMockBotOptions = {
	client: MockClient,
	logger: MockLogger,
	commands: MockCommandList,
	...MockDefaultConfig,
};

/**
 * @type {Bot}
 *
 * A test bot that uses the default options
 */
export const MockBot = new Bot({
	...defaultMockBotOptions,
});

/**
 * - Makes a test bot with the given options.
 * - Use `mockCommand` to setup the given command in the test bot's command collection.
 */
export const makeMockBot = ({ mockCommand, ...overrides }) => {
	const commands = mockCommand ? [mockCommand] : MockCommandList;

	return new Bot({
		commands,
		includeDefaultCommands: false,
		...overrides,
	});
};

/**
 * @description
 * Mock options to configure commands with
 */
export const MockCommandOptions = {
	bot: MockBot,
	client: {},
	message: {
		author: {
			id: 'TestMemberID',
			bot: false,
		},
		reply: jest.fn(message => message),
		member: {
			id: 'TestMemberID',
			guild: {
				id: 'TestGuildID',
				owner: { id: 'TestMemberID' },
			},
			hasPermission: jest.fn(() => true),
		},
		channel: {
			id: 'TestChannelID',
			send: jest.fn(message => message),
		},
	},
	logger: MockLogger,
};

/**
 * @param {Command} command The command to run.
 * - Needs to be instantiated before passed into this function
 *
 * @description
 * - Executes the `run` method of the given command.
 * - Returns back the command options, including mock results within `message` if applicable.
 */
export async function runCommand(command, overrides = {}) {
	const commandOptions = { ...MockCommandOptions, ...overrides };

	await command.run(commandOptions);
	return commandOptions;
}
