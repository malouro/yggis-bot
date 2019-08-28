class CommandError extends Error {
	constructor(message) {
		super(message)

		this.name = 'CommandError'
	}
}

class MissingPropertyError extends CommandError {
	constructor(property) {
		super(`No property \`${property}\``)

		this.name = 'MissingProperty'
		this.property = property
	}
}

class InvalidPropertyError extends CommandError {
	constructor(property, context) {
		super(`Incorrect property definition for \`${property}\` (${context})`)

		this.name = 'IncorrectProperty'
		this.property = property
	}
}

export { CommandError, MissingPropertyError, InvalidPropertyError }
