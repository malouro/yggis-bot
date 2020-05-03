/** @todo Flesh out Typescript support + example(s) */

/* eslint-disable-next-line import/no-extraneous-dependencies */
import { config as dotenvConfig } from 'dotenv';

import { Bot, getCommands } from '../../src';
import Command from '../../src/classes/Command';

dotenvConfig();

class CustomCommand extends Command {
	constructor() {
		super({
			name: 'Custom',
		});
	}
}

// const Yggis = new Bot({
// 	commands: getCommands([CustomCommand], { includeDefaults: true }),
// });

// Yggis.start();
