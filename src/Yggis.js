import { config as dotenvConfig } from 'dotenv';

import Bot from './classes/Bot';
import logger from './utils/logger';
import { getCommands } from './utils/setup';

dotenvConfig();

const Yggis = new Bot({
	config: {
		statusMessage: 'test',
	},
	logger,
	commands: getCommands(),
});

Yggis.start();
