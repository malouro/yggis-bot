import Discord from 'discord.js'

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
		this.commandPrefix = config.commandPrefix

		/* logger utils */
		this.logger = logger

		/* Discord.js client & events */
		this.client = client
		this.client.on('ready', this.onReady.bind(this))
		this.client.on('message', this.onMessage.bind(this))
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
		let args = []

		let commandName = null

		if (message.content.startsWith(this.config.commandPrefix)) {
			args = getArgumentsFromMessage(message)
			commandName = getCommandFromMessage(args, this.config)

			if (this.commands.has(commandName)) {
				this.commands.get(commandName).run({
					message,
					client: this.client,
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
