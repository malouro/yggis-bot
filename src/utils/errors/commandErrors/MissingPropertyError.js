import CommandError from './CommandError';

export default class MissingPropertyError extends CommandError {
	constructor(property) {
		super(`No property \`${property}\``);

		this.name = 'MissingProperty';
		this.property = property;
	}
}
