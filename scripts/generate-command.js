const fs = require('fs');
const path = require('path');
const camelCase = require('lodash/camelCase');
const { argv } = require('yargs')
	.usage('Usage: node $0 --')
	.options({
		n: {
			alias: ['name', 'commandName'],
			demandOption: true,
			describe: 'Name of the command to make',
			type: 'string',
		},
		c: {
			alias: 'category',
			demandOption: true,
			describe: 'Category/directory for the command',
			default: '',
			type: 'string',
		},
		a: {
			alias: 'aliases',
			demandOption: false,
			describe: 'List of aliases for the command',
			default: [],
			type: 'array',
		},
		o: {
			alias: 'outputDir',
			demandOption: false,
			describe: 'Filename/path to output the new command to',
			default: './',
			type: 'string',
		},
	});

const outputDir = argv.o;
const commandClassRelativePath = path
	.relative(
		path.resolve(process.cwd(), outputDir),
		path.resolve(__dirname, '../src/classes')
	)
	.replace(/\\/g, '/');

if (commandClassRelativePath.startsWith('./../')) {
	commandClassRelativePath.slice(0, 1);
}

const CommandTitle =
	camelCase(argv.n)[0].toUpperCase() + camelCase(argv.n).slice(1);
const formattedArgs = argv.a.map(val => `'${val}'`).join(', ');

const content = `
import { Command } from '${commandClassRelativePath}';

export default class ${CommandTitle} extends Command {
	constructor() {
		super({
			name: '${CommandTitle}',
			aliases: [${formattedArgs}],
		});
	}

	// eslint-disable-next-line no-unused-vars
	action({ bot, client, message, args, logger }) {
		// Define the action of the command in here
	}
}

`;

const writeDir = path.join(process.cwd(), outputDir);
const writePath = path.join(writeDir, `${CommandTitle}.js`);

if (!fs.existsSync(writeDir)) {
	fs.mkdirSync(writeDir);
}

fs.writeFileSync(path.join(writePath), `${content.trim()}\n`);

/** @todo ? */
// console.log(`Done writing file to ${writePath}`);
