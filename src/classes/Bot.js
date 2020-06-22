import { Client, Collection } from 'discord.js';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import merge from 'lodash/merge';

import defaultConfig from '../constants/defaultConfig';
import defaultLogger from '../utils/logger';
import {
	getArgumentsFromMessage,
	getCommandFromMessage,
} from '../utils/commands';
import { MissingTokenError } from '../utils/errors';
import getCommands from '../utils/setup/getCommands';
import { translate } from '../utils/i18n';
import defaultTranslations from '../i18n/en-US';

export default class Bot {
	constructor({
		/* info */
		name = 'Yggis',
		client = new Client(),
		logger = defaultLogger,
		/* i18n */
		t,
		language = 'en-US',
		translations,
		includeDefaultTranslations = true,
		/* commands */
		commandPrefix,
		commands = [],
		includeDefaultCommands = true,
		/* command categories */
		commandCategories = [],
		includeDefaultCommandCategories = true,
		/* events */
		eventHandlers = {},
		/* status */
		statusMessage,
		statusMessageOptions,
		/* auth */
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
		this.name = name;

		/* i18n */
		this.language = language;

		/** @todo find better way to set up translations */
		this.translations = includeDefaultTranslations
			? merge({ 'en-US': defaultTranslations }, translations)
			: translations || { 'en-US': defaultTranslations };
		this.t =
			t ||
			translate({
				defaultSpace: 'COMMON',
				translations: this.translations,
				language: this.language,
			});

		/* setup commands */
		[this.commands, this.commandAliases] = this.getCommands({
			commands,
			includeDefaultCommands,
		});
		this.commandPrefix = commandPrefix || this.commandPrefix;
		this.commandCategories =
			includeDefaultCommands || includeDefaultCommandCategories
				? ['debug', 'fun', ...commandCategories]
				: commandCategories;
		this._commandCategories = this.getCategories();

		/* event handlers */
		this.eventHandlers = eventHandlers;

		/* setup status message */
		this.statusMessage = statusMessage || this.statusMessage;
		this.statusMessageOptions =
			statusMessageOptions || this.statusMessageOptions;

		/* logger utils */
		this.logger = logger;

		/* Discord.js client & events */
		this.client = client;
		this.client.on(
			'ready',
			this.eventHandlers.ready || this.onReady.bind(this)
		);
		this.client.on(
			'reconnecting',
			this.eventHandlers.reconnecting || this.onReconnecting.bind(this)
		);
		this.client.on(
			'disconnect',
			this.eventHandlers.disconnect || this.onDisconnect.bind(this)
		);
		this.client.on(
			'message',
			this.eventHandlers.message || this.onMessage.bind(this)
		);
	}

	getCategories() {
		const categories = new Collection();

		this.commands.forEach(({ name: commandName, category }) => {
			if (!categories.has(category)) {
				categories.set(category, {
					name: upperFirst(camelCase(category)),
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

	getCommands({ commands, includeDefaultCommands }) {
		const [commandCollection, aliasCollection] = getCommands(commands, {
			includeDefaults: includeDefaultCommands,
			t: this.t,
		});

		const battleReadyCommands = new Map(
			[...commandCollection.entries()].sort()
		);

		return [battleReadyCommands, aliasCollection];
	}

	onReady() {
		this.client.user.setActivity(this.statusMessage, this.statusMessageOptions);
		this.logger.bot.log({
			level: 'info',
			message: 'Ready!',
		});
	}

	onReconnecting() {
		this.logger.bot.log({
			level: 'info',
			message: 'Reconnecting...',
		});
	}

	onDisconnect() {
		this.logger.bot.log({
			level: 'info',
			message: 'Disconnected',
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
			} else if (this.commandAliases.has(commandName)) {
				this.commands.get(this.commandAliases.get(commandName)).run({
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

	async start() {
		await this.client.login(this.token);
	}
}
