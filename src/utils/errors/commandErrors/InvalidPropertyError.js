import CommandError from './CommandError'

export default class InvalidPropertyError extends CommandError {
	constructor(property, context) {
		super(`Incorrect property definition for \`${property}\` (${context})`)

		this.name = 'IncorrectProperty'
		this.property = property
	}
}
