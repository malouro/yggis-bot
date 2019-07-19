import { EventEmitter } from 'events'
import { Bot } from '../src/classes'
import { loggerNames } from '../src/utils/logger'

/* Mock for bot configuration file */
export const MockConfig = {
	commandPrefix: 'testPrefix',
	statusMessage: 'testStatusMessage',
	statusMessageOptions: {
		type: 'statusMessageType',
		url: 'statusMessageUrl',
	},
}

/* Mock for oauth Discord Bot token */
export const MockToken = `M${'a'.repeat(23)}.${'a'.repeat(6)}.${'a'.repeat(27)}`

/* Mock logger from /utils/ */
const MockLogger = {}
loggerNames.forEach((type) => {
	MockLogger[type] = {
		log: jest.fn(logMessage => logMessage),
	}
})
export { MockLogger }

/* Mock Discord.js Client */
export const MockClient = new EventEmitter()

/* Mock Yggis bot */
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
	},
	logger: MockLogger,
}

/* Run a given command. Allows for default options & overrides */
export async function runCommand(command, overrides = {}) {
	const Mocks = Object.assign({}, MockCommandOptions, overrides)
	await command.run(Mocks)
	return Mocks
}
