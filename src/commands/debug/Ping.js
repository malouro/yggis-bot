import { Command } from '../../classes'

export default class Ping extends Command {
	constructor() {
		super({
			name: 'Ping',
			category: 'debug',
			aliases: [],
			description: 'See the bot\'s response time to the server.',
			usage: {
				name: 'ping',
				args: [],
			},
		})
	}

	action({ client, message, logger }) {
		message.reply(`Pong! \`${Math.round(client.ping)} ms\``)
		logger.debug.log({
			level: 'info',
			message: `${message.author} has used the \`Ping\` command!`,
		})
	}
}
