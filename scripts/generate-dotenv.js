const fs = require('fs')
const path = require('path')
const { argv } = require('yargs')
	.usage('Usage: $0 --token [token] --userid [number]')
	.alias('token', 't')
	.alias('userid', 'u')
	.alias('test', 'T')

	.demandOption(['token'])
	.default('userid', '')
	.default('test', false)

	.describe('token', 'Token for your Discord bot')
	.describe('userid', 'Your Discord user ID')
	.describe('test', 'Whether or not this config is for a test environment')

const content = `
# ${argv.test ? 'Test ' : ''}.env config for Yggis-bot
TOKEN=${argv.token}
MASTER_ID=${argv.userid}
`

const fileName = argv.test ? '.env.test' : '.env'

fs.writeFileSync(path.join(process.cwd(), fileName), content.trim())
