import noop from 'lodash/noop'

import { MissingPropertyError, InvalidPropertyError } from '../utils/errors'
import { canUseCommand } from '../utils/commands'

export default class Command {
	constructor(options = {}) {
		/* Default options if not provided */
		Object.assign(this, {
			category: 'misc',
			aliases: [],
			disabled: false,
			permLevel: 0,
			description: '',
			usage: { name: this.name || '', args: [] },
		}, options)

		/* Command properties to verify */
		this.validateOptions()
	}

	validateOptions() {
		if (!this.name) {
			throw new MissingPropertyError('name')
		}

		if (
			typeof this.permLevel !== 'number'
			|| !(this.permLevel >= 0 && this.permLevel <= 5)
		) {
			throw new InvalidPropertyError('permLevel', 'Not an integer in range (0, 5)')
		}
	}

	preAction(args) {
		noop(args)
	}

	action(args) {
		noop(args)
	}

	postAction(args) {
		noop(args)
	}

	async run({
		bot,
		client,
		message,
		args,
		logger,
	}) {
		const actionArgs = {
			bot,
			client,
			message,
			args,
			logger,
		}

		if (this.disabled) {
			return null
		}

		if (!canUseCommand(message.member, this.permLevel)) {
			return message.reply(
				'You do not have the required permissions to use this command. 😥'
			)
		}

		await this.preAction(actionArgs)
		await this.action(actionArgs)
		await this.postAction(actionArgs)
	}
}
