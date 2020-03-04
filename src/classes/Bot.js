import Discord, { Collection } from 'discord.js';

import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';

import defaultConfig from '../constants/defaultConfig';
import defaultLogger from '../utils/logger';
import {
	getArgumentsFromMessage,
	getCommandFromMessage,
} from '../utils/commands';
import { MissingTokenError } from '../utils/errors';

export default class Bot {
	constructor({
		name = 'Yggis',
		client = new Discord.Client(),
		commandPrefix,
		commandCategories,
		statusMessage,
		statusMessageOptions,
		commands = new Discord.Collection(),
		logger = defaultLogger,
		token,
	} = {}) {
		/* oauth token for Discord bot */
		if (
			(!token || typeof token !== 'string') &&
			(!process.env.TOKEN || typeof process.env.TOKEN !== 'string')
		) {
			throw new MissingTokenError();
		}
		this.token = token || process.env.TOKEN;

		/* setup with defaults */
		Object.assign(this, defaultConfig);

		/* bot name */
		this.name = name || this.name;

		/* setup commands */
		this.commands = new Map([...commands.entries()].sort());
		this.commandPrefix = commandPrefix || this.commandPrefix;
		this.commandCategories = {
			...defaultConfig.commandCategories,
			...commandCategories,
		};
		this._commandCategories = this.getCategories();

		/* setup status message */
		this.statusMessage = statusMessage || this.statusMessage;
		this.statusMessageOptions =
			statusMessageOptions || this.statusMessageOptions;

		/* logger utils */
		this.logger = logger;

		/* Discord.js client & events */
		this.client = client;
		this.client.on('ready', this.onReady.bind(this));
		this.client.on('message', this.onMessage.bind(this));
	}

	getCategories() {
		const categories = new Collection();

		this.commands.forEach(({ name: commandName, category }) => {
			if (!categories.has(category)) {
				categories.set(category, {
					...(this.commandCategories[category] || {
						name: upperFirst(camelCase(category)),
					}),
					commands: [commandName.toLocaleLowerCase()],
				});
			} else {
				const categoryData = categories.get(category);

				categories.set(category, {
					...categoryData,
					commands: [...categoryData.commands, commandName.toLocaleLowerCase()],
				});
			}
		});

		return categories;
	}

	onReady() {
		this.client.user.setActivity(this.statusMessage, this.statusMessageOptions);
		this.logger.bot.log({
			level: 'info',
			message: 'Ready!',
		});
	}

	onMessage(message) {
		if (message.author.bot && process.env.NODE_ENV !== 'test') return null;

		let args = [];
		let commandName = null;

		if (message.content.startsWith(this.commandPrefix)) {
			args = getArgumentsFromMessage(message) || [];
			commandName = getCommandFromMessage(args, this.commandPrefix);

			if (this.commands.has(commandName)) {
				this.commands.get(commandName).run({
					bot: this,
					client: this.client,
					message,
					args,
					logger: this.logger,
				});
			}
		}

		this.logger.bot.log({
			level: 'info',
			message: `Message received: "${message.content}"`,
		});
	}

	start() {
		this.client.login(this.token);
	}
}
