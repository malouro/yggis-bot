export default class I18nError extends Error {
	constructor(message) {
		super(message);

		this.name = 'I18nError';
	}
}
