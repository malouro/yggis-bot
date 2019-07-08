import { config } from 'dotenv'

import Bot from './classes/Bot'
import logger from './utils/logger'
import { getCommands } from './utils/setup'

config()

const Yggis = new Bot({
	logger,
	config: {
		statusMessage: 'test',
	},
	commands: getCommands(),
})

Yggis.start()
