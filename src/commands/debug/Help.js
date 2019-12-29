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
						name: 'category',
						description: 'Learn more about commands available under a given category.',
						chainable: false,
					},
				],
			},
		})

		this.messageOutput = ''
	}

	buildMainHelpMenu({ commandPrefix, name: botName }, commands, categories) {
		const commandList = Array.from(commands.values())
			.map(command => `\`${commandPrefix}${command.name.toLocaleLowerCase()}\``)
			.join(', ')

		return [
			`**__${botName} Help Menu__**`,
			'',
			'**Commands**',
			'',
			commandList,
		].join('\n')
	}

	buildCommandHelpMenu(commandPrefix, command, invalidUsage = false) {
		const { description, usage } = command

		const chainableArgs = []
		const nonChainableArgs = []

		usage.args.forEach((arg) => {
			if (arg.chainable) {
				chainableArgs.push(arg.name)
			} else {
				nonChainableArgs.push(arg.name)
			}
		})

		const getArgsUsage = () => {
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

		const getDetailedArgsDescription = () => {
			let argsDetailsOutput = ''

			usage.args.forEach((arg, index) => {
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

		const title = `**${command.name} Command**`
		const commandUsage = `\`${commandPrefix}${command.name.toLocaleLowerCase()}\` ${getArgsUsage()}`

		return [
			invalidUsage
				? `Invalid \`${commandPrefix}${command.name.toLocaleLowerCase()}\` usage.`
				: title,
			invalidUsage
				? ''
				: `\n${description || '(Missing description.)'}\n`,
			commandUsage,
			getDetailedArgsDescription(),
		].join('\n')
	}

	buildCategoryHelpMenu(commandPrefix, category) {
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
				bot.commands,
				bot.commandCategories,
			)
		} else if (bot.commands.has(args[1])) {
			// !help <command>
			this.messageOutput = this.buildCommandHelpMenu(
				bot.commandPrefix,
				bot.commands.get(args[1].toLocaleLowerCase()),
			)
		} else if (bot.commandCategories.has(args[1])) {
			// !help <category>
			this.messageOutput = this.buildCategoryHelpMenu(
				bot.commandPrefix,
				bot.commandCategories.get(args[1].toLocaleLowerCase()),
			)
		} else {
			// !help {invalidUsage}
			this.messageOutput = this.buildCommandHelpMenu(
				bot.commandPrefix,
				this,
				true
			)
		}
	}

	action({ message }) {
		message.channel.send(this.messageOutput)
	}
}
