import { MissingPropertyError } from '../utils/errors'

function noop() {
	/** @func noop */
}

function validateCommandProperties(options) {
	if (!options.name) {
		throw new MissingPropertyError('name')
	}
}

export default class Command {
	constructor({ name, aliases, disabled = false } = {}) {
		/* Command properties to verify */
		validateCommandProperties({
			name,
		})

		this.name = name
		this.aliases = aliases || []
		this.disabled = disabled
	}

	preAction() {
		noop()
	}

	action() {
		noop()
	}

	postAction() {
		noop()
	}

	async run({ client, message, logger }) {
		if (this.disabled) {
			return null
		}

		await this.preAction({ client, message, logger })
		await this.action({ client, message, logger })
		await this.postAction({ client, message, logger })

		return 0
	}
}
