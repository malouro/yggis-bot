import { config } from 'dotenv'
import Bot from './classes/Bot'
import logger from './utils/logger'

config()

const Yggis = new Bot({
	logger,
	config: {
		statusMessage: 'test',
	},
})

Yggis.start()
