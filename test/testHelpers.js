import { EventEmitter } from 'events'
import { Bot } from '../src/classes'
import { loggerNames } from '../src/utils/logger'

export const MockToken = `M${'a'.repeat(23)}.${'a'.repeat(6)}.${'a'.repeat(27)}`
export const MockMasterID = 'MasterID'

/* Setup for the mocked Bot */
export const MockConfig = {
	commandPrefix: 'testPrefix',
	statusMessage: 'testStatusMessage',
	statusMessageOptions: {
		type: 'statusMessageType',
		url: 'statusMessageUrl',
	},
}

export const MockMember = {
	hasPermission: () => false,
	id: 'NotTheMaster :(',
	guild: { owner: { id: 'NotTheOwner :(' } },
}

export const MockClient = new EventEmitter()

const MockLogger = {}

loggerNames.forEach((type) => {
	MockLogger[type] = {
		log: jest.fn(logMessage => logMessage),
	}
})

export { MockLogger }

/**
 * @property {Discord.Client} client
 * 	Mocked Discord Client instance
 * @property {Object} config
 * 	The MockConfig defined above; serves as the configuration for the MockBot
 * @property {Winston.Logger} logger
 * 	A mocked logger instance that will capture all log events with a Jest mock function
 */
export const MockBot = new Bot({
	client: MockClient,
	config: MockConfig,
	logger: MockLogger,
})

/* Mock options to configure commands with */
export const MockCommandOptions = {
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
	},
	logger: MockLogger,
}

/* Run a given command. Allows for default options & overrides */
export async function runCommand(command, overrides = {}) {
	const commandOptions = { ...MockCommandOptions, ...overrides }

	await command.run(commandOptions)
	return commandOptions
}
