import { config as dotenvConfig } from 'dotenv';

import { Bot, getCommands, Command } from '../src';

dotenvConfig();

class CustomCommand extends Command {
	constructor() {
		super({ name: 'Custom' });
	}
}

const Yggis = new Bot({
	commands: getCommands([CustomCommand], { includeDefaults: true }),
});

Yggis.start();
