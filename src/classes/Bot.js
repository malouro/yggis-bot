import Discord, { Collection } from 'discord.js'

import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'

import defaultConfig from '../constants/config'
import defaultLogger from '../utils/logger'

import {
	getArgumentsFromMessage,
	getCommandFromMessage,
} from '../utils/commands'

export default class Bot {
	constructor({
		client = new Discord.Client(),
		commands = new Discord.Collection(),
		config,
		logger = defaultLogger,
		token = process.env.TOKEN,
	}) {
		/* oauth token for Discord bot */
		this.token = token

		/* create config */
		this.config = {
			...defaultConfig,
			...config,
		}

		/* setup commands */
		this.commands = commands
		this.commandPrefix = this.config.commandPrefix
		this.commandCategories = this.getCategories()

		/* logger utils */
		this.logger = logger

		/* Discord.js client & events */
		this.client = client
		this.client.on('ready', this.onReady.bind(this))
		this.client.on('message', this.onMessage.bind(this))
	}

	getCategories() {
		const categories = new Collection()

		this.commands.forEach(({ name: commandName, category }) => {
			if (!categories.has(category)) {
				categories.set(category, {
					...(this.config.commandCategories[category] || {
						name: upperFirst(camelCase(category))
					}),
					commands: [commandName.toLocaleLowerCase()],
				})
			} else {
				const categoryData = categories.get(category)

				categories.set(category, {
					...categoryData,
					commands: [...categoryData.commands, commandName.toLocaleLowerCase()],
				})
			}
		})

		return categories
	}

	onReady() {
		this.client.user.setActivity(
			this.config.statusMessage,
			this.config.statusMessageOptions,
		)
		this.logger.bot.log({
			level: 'info',
			message: 'Ready!',
		})
	}

	onMessage(message) {
		if (message.author.bot && process.env.NODE_ENV !== 'test') return null

		let args = []
		let commandName = null

		if (message.content.startsWith(this.config.commandPrefix)) {
			args = getArgumentsFromMessage(message) || []
			commandName = getCommandFromMessage(args, this.config)

			if (this.commands.has(commandName)) {
				this.commands.get(commandName).run({
					bot: this,
					client: this.client,
					message,
					args,
					logger: this.logger,
				})
			}
		}

		this.logger.bot.log({
			level: 'info',
			message: `Message received: "${message.content}"`,
		})
	}

	start() {
		this.client.login(this.token)
	}
}
