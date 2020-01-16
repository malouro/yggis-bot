import { Command } from '../../classes'

export default class Help extends Command {
	constructor() {
		super({
			name: 'Help',
			category: 'debug',
			aliases: [],
			description: 'Help menus, support and information. Find out what commands exist and how to use them.',
			usage: {
				args: [
					{
						name: 'command',
						description: 'Get help on how to use a specific command.',
						chainable: false,
					},
					{
						name: 'commandCategory',
						description: 'Learn more about commands available under a given category.',
						chainable: false,
					},
				],
			},
		})

		this.messageOutput = ''
	}

	getCommandArgs(command) {
		const { usage } = command

		const chainableArgs = []
		const nonChainableArgs = []

		usage.args.forEach((arg) => {
			if (arg.chainable) {
				chainableArgs.push(arg.name)
			} else {
				nonChainableArgs.push(arg.name)
			}
		})

		return {
			chainableArgs,
			nonChainableArgs
		}
	}

	getCommandArgsUsage(chainableArgs, nonChainableArgs) {
		let argsUsageOutput = ''

		if (nonChainableArgs.length > 0) {
			argsUsageOutput = argsUsageOutput.concat(
				'`<',
				nonChainableArgs.join('|'),
				'>`',
			)
		}

		if (chainableArgs.length > 0) {
			argsUsageOutput = argsUsageOutput.concat(
				nonChainableArgs.length > 0 ? ' ' : '',
				'`(',
				chainableArgs.join(', '),
				')`',
			)
		}

		return argsUsageOutput
	}

	getDetailedArgsDescription(args) {
		let argsDetailsOutput = ''

		args.forEach((arg, index) => {
			argsDetailsOutput = argsDetailsOutput.concat(
				index === 0 ? '\n' : '\n\n',
				`\`${arg.name}\``,
				'\n',
				arg.description || '(Missing description.)',
				arg.usage ? `${'\n'.repeat(2)}\`${arg.usage}\`` : '',
			)
		})

		return argsDetailsOutput
	}

	buildMainHelpMenu({ commandPrefix, name: botName }, categories) {
		const { chainableArgs, nonChainableArgs } = this.getCommandArgs(this)

		const commandList = categories
			.map(category =>
				`> ${category.name} commands\n`.concat(
					category.commands
						.map(command => `\`${commandPrefix}${command}\``)
						.join(', ')
				))
			.join('\n\n')

		const helpCommandUsage = String.prototype.concat(
			`\`${commandPrefix}${this.name.toLocaleLowerCase()}\``,
			' ',
			`${this.getCommandArgsUsage(chainableArgs, nonChainableArgs)}`
		)

		return [
			`**__${botName} Help Menu__**`,
			'',
			helpCommandUsage,
			'',
			'**Commands**',
			'',
			commandList,
		].join('\n')
	}

	buildCommandHelpMenu({ commandPrefix }, command, invalidUsage = false) {
		const { description, usage } = command
		const { chainableArgs, nonChainableArgs } = this.getCommandArgs(command)

		const title = `**${command.name} Command**`

		const commandUsage = String.prototype.concat(
			`\`${commandPrefix}${command.name.toLocaleLowerCase()}\``,
			' ',
			`${this.getCommandArgsUsage(chainableArgs, nonChainableArgs)}`
		)

		return [
			invalidUsage
				? `Invalid \`${commandPrefix}${command.name.toLocaleLowerCase()}\` usage.`
				: title,
			invalidUsage
				? ''
				: `\n${description || '(Missing description.)'}\n`,
			commandUsage,
			this.getDetailedArgsDescription(usage.args),
		].join('\n')
	}

	buildCategoryHelpMenu({ commandPrefix }, category) {
		const { name, description, commands } = category
		const title = `**${name} Commands**`

		const commandList = commands
			.map(command => `\`${commandPrefix}${command}\``)
			.join(', ')

		return [
			title,
			description ? `\n${description}\n` : '',
			commandList
		].join('\n')
	}

	preAction({ args, bot }) {
		if (args.length === 1) {
			// !help (no args)
			this.messageOutput = this.buildMainHelpMenu(
				bot,
				bot.commandCategories,
			)
		} else if (bot.commands.has(args[1])) {
			// !help <command>
			this.messageOutput = this.buildCommandHelpMenu(
				bot,
				bot.commands.get(args[1].toLocaleLowerCase()),
			)
		} else if (bot.commandCategories.has(args[1])) {
			// !help <category>
			this.messageOutput = this.buildCategoryHelpMenu(
				bot,
				bot.commandCategories.get(args[1].toLocaleLowerCase()),
			)
		} else {
			// !help {invalidUsage}
			this.messageOutput = this.buildCommandHelpMenu(
				bot,
				this,
				true
			)
		}
	}

	action({ message }) {
		message.channel.send(this.messageOutput)
	}
}
