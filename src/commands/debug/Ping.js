import Command from '../../classes/Command';

export default class Ping extends Command {
	constructor({ t } = { t: () => null }) {
		super({
			name: 'Ping',
			category: 'debug',
			aliases: [],
			description: "See the bot's response time to the server.",
			usage: {
				name: 'ping',
				args: [],
			},
		});

		/* setup i18n */
		this.t = key => t('COMMANDS', 'ping', key);

		this.name = this.t('name') || this.name;
		this.description = this.t('description') || this.description;
	}

	action({ client, message, logger }) {
		message.reply(this.t('response')(Math.round(client.ping)));

		logger.debug.log({
			level: 'info',
			message: `${message.author} has used the \`Ping\` command!`,
		});
	}
}
