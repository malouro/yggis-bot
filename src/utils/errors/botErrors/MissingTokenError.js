import BotError from './BotError';

export default class MissingTokenError extends BotError {
	constructor() {
		super(
			[
				'Missing or invalid `token` in config!',
				'You can pass this via `process.env.TOKEN`, or the `token` property in the Yggis-bot config',
			].join('\n')
		);

		this.name = 'MissingToken';
	}
}
