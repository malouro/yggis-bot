import { EventEmitter } from 'events'
import { Bot, Command } from '../src/classes'
import { loggerNames } from '../src/utils/logger'
import { getCommands } from '../src/utils/setup'
import { makeCommandFromModule } from '../src/utils/commands'
import { Collection, Client, GuildMember } from 'discord.js'

/** @description A mock of a Discord OAUTH token */
export const MockToken = `M${'a'.repeat(23)}.${'a'.repeat(6)}.${'a'.repeat(27)}`


/**
 * @type {string}
 *
 * @description
 * A mock of a Discord user ID to use as the bot's master.
 */
export const MockMasterID = 'MasterID'


/**
 * @typedef {{ commandPrefix: string, statusMessage: string, statusMessageOptions: { type: string, url: string }}}
 * 
 * @description
 * A mock of the config to use for the test bot. Follows the template defined in `/src/constants/config.js`
 */
export const MockConfig = {
	commandPrefix: 'testPrefix',
	statusMessage: 'testStatusMessage',
	statusMessageOptions: {
		type: 'statusMessageType',
		url: 'statusMessageUrl',
	},
}


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
}


/**
 * @type {EventEmitter}
 * 
 * @description
 * A basic mock of a Discord.js Client
 */
export const MockClient = new EventEmitter()


/**
 * @type {{ [key: string]: { log: jest.fn } }}
 */
const MockLogger = {}

loggerNames.forEach((type) => {
	MockLogger[type] = {
		log: jest.fn(logMessage => logMessage),
	}
})
export { MockLogger }


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
		})
	}
}


/**
 * @param {Object} options - List of options to configure the mock command with
 * 
 * @description
 * - This will make a command with the Command class defined in `/src/classes/`.
 * - The key name of the command class (and prototype property of `name`) will default to 'MockCommand'.
 */
export const makeMockCommand = ({ name = 'MockCommand', ...otherOptions }) => ({
	[name]: class extends Command {
		constructor() {
			super({
				name,
				...otherOptions,
			})
		}
	}
}[name])


/**
 * @type {Collection<String, Command>}
 *
 * @description
 * Uses the `getCommands` utility function to make a `Discord.Collection` containing the `MockCommand` defined above.
 */
export const MockCommandList = getCommands([makeCommandFromModule(MockCommand)])


/**
 * @typedef {{ client: Client, config: Object, logger: Logger, commands: Collection<String, Command> }}
 *
 * @description
 * Default options to initialize the test bot with.
 */
export const defaultMockBotOptions = {
	client: MockClient,
	config: MockConfig,
	logger: MockLogger,
	commands: MockCommandList,
}


/**
 * @type {Bot}
 * 
 * A test bot that uses the default options
 */
export const MockBot = new Bot({
	...defaultMockBotOptions
})


/**
 * - Makes a test bot with the given options.
 * - Use the config option called `mockCommand` to setup the given command in the test bot's command collection.
 */
export const makeMockBot = ({ mockCommand, ...overrides }) => {
	const commands = mockCommand ? getCommands([makeCommandFromModule(mockCommand)]) : MockCommandList

	return new Bot({
		commands,
		...overrides
	})
}

/**
 * @description
 * Mock options to configure commands with
 */
export const MockCommandOptions = {
	bot: MockBot,
	client: {},
	message: {
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
}


/**
 * @param {Command} command The command to run. Needs to be instantiated before passed into this function
 * 
 * @description
 * - Executes the `run` method of the given command.
 * - Returns back the given command options, which should include mock results within `message` if applicable.
 */
export async function runCommand(command, overrides = {}) {
	const commandOptions = { ...MockCommandOptions, ...overrides }

	await command.run(commandOptions)
	return commandOptions
}
