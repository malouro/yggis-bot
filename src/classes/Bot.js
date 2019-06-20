import Discord from 'discord.js'

import defaultConfig from '../constants/config'
import defaultLogger from '../utils/logger'

export default class Bot {
	constructor({
		config,
		token = process.env.TOKEN,
		client = new Discord.Client(),
		logger = defaultLogger,
	}) {
		/* oauth token for Discord bot */
		this.token = token

		/* create config */
		this.config = {
			...defaultConfig,
			...config,
		}
		this.commandPrefix = config.commandPrefix

		/* logger utils */
		this.logger = logger

		/* Discord.js Client */
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
		const { content } = message

		this.logger.bot.log({
			level: 'info',
			message: `Message received: "${content}"`,
		})
	}

	start() {
		this.client.login(this.token)
	}
}
