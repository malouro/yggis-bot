const fs = require('fs')
const path = require('path')
const { argv } = require('yargs')
	.usage('Usage: node $0 --token [token] (options)')
	.options({
		t: {
			alias: 'token',
			demandOption: true,
			describe: 'Token for your Discord bot',
			type: 'string',
		},
		u: {
			alias: 'userID',
			demandOption: false,
			describe: 'Your Discord user ID',
			default: '',
			type: 'string',
		},
		g: {
			alias: 'guildID',
			demandOption: false,
			describe: 'Your Discord guild (server) ID',
			default: '',
			type: 'string',
		},
		o: {
			alias: 'outputFile',
			demandOption: false,
			describe: 'Filename/path to output the env config to',
			default: '.env',
			type: 'string',
		},
	})

const content = `
# env config for Yggis-bot
TOKEN=${argv.t}
MASTER_ID=${argv.u}
GUILD_ID=${argv.g}
`

const fileName = argv.o

fs.writeFileSync(path.join(process.cwd(), fileName), content.trim())
