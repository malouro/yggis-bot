import { Command } from '../../classes'

export default class Ping extends Command {
	constructor() {
		super({
			name: 'Ping',
			aliases: ['test'],
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
