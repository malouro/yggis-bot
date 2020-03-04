export default class BotError extends Error {
	constructor(message) {
		super(message);

		this.name = 'BotError';
	}
}
