export default {
	ping: {
		name: 'Ping',
		description: "See the bot's response time to the server. 🤖",
		response: ping => `Pong! \`${ping} ms\``,
	},
	help: {
		/* General command info */
		name: 'Help',
		description:
			'Help menus, support and information. Find out what commands exist and how to use them. 💁‍♀️',
		/* Usage of the Help command */
		usage: {
			command: {
				name: 'command',
				description: 'Get help on how to use a specific command.',
			},
			commandCategory: {
				name: 'commandCategory',
				description:
					'Learn more about commands available under a given category.',
			},
		},
		/* Help menu builders */
		mainMenuHeader: botName => `**__${botName} Help Menu__**`,
		mainMenuCommandsHeader: '**Commands**',
		mainMenuCategoryHeader: category => `> ${category} commands\n`,
		commandHeader: commandName => `**${commandName} Command**`,
		categoryHeader: category => `**${category} Commands**`,
		/* Error handling */
		invalidCommandUsage: (commandPrefix, commandName) =>
			`Invalid \`${commandPrefix}${commandName}\` usage.\n`,
		missingArgumentDescription: '(Missing description.)',
	},
	reddit: {
		name: 'Reddit',
		description: 'Grab a random Reddit post from a specific subreddit.',
		invalidSubreddit: subreddit =>
			`Oops! The subreddit \`/r/${subreddit}\` is either empty or non-existent.`,
		postedByText: (title, author) => `**${title}**\nposted by ${author}`,
		usage: {
			subreddit: {
				name: 'subreddit',
				description: 'The subreddit to grab a post from.',
			},
		},
	},
	aww: {
		name: 'Aww',
		description: 'Grab a cute & cuddly post from the /r/aww subreddit.',
	},
	categories: {
		debug: {
			name: 'Debug',
			description: 'Commands that assist with debugging and support. 🔧',
		},
		fun: {
			name: 'Fun',
			description: 'Have a bit of fun with these commands. 😄',
		},
	},
};
