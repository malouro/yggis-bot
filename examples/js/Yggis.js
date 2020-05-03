/* eslint-disable-next-line import/no-extraneous-dependencies */
import { config as dotenvConfig } from 'dotenv';

import { Bot, Command } from '../../src';

/**
 * # .env file contents:
 *
 * TOKEN=<DISCORD_AUTH_TOKEN_GOES_HERE>
 * MASTER_ID=<YOUR_DISCORD_USER_ID_GOES_HERE>
 */
dotenvConfig();

class ExampleCommand extends Command {
	constructor() {
		super({ name: 'Hotdog', aliases: ['dog', '🌭'] });
	}

	action({ message }) {
		message.reply('🌭');
	}
}

const Yggis = new Bot({
	commandPrefix: '~',
	commands: [ExampleCommand],
});

Yggis.start();
