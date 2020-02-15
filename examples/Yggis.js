import { config as dotenvConfig } from 'dotenv';

import { Bot, getCommands } from '../src';

dotenvConfig();

const Yggis = new Bot({
	commands: getCommands(),
});

Yggis.start();
