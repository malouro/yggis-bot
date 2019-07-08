import {
	createLogger, format, transports, addColors,
} from 'winston'

const {
	combine, timestamp, label, printf,
} = format

const formatting = printf(
	({
		label: logLabel,
		level,
		message,
		timestamp: logTimestamp,
	}) => `► ${logTimestamp} | \x1b[1m[${logLabel}]\x1b[0m ${level} ${message}`,
)

const customLevels = {
	levels: {
		error: 0,
		warn: 1,
		info: 2,
		debug: 3,
		silly: 4,
	},
	colors: {
		error: 'bold black redBG',
		warn: 'bold black yellowBG',
		info: 'bold blue',
		debug: 'bold grey',
		silly: 'italic magenta',
	},
}

addColors(customLevels.colors)

const createCustomLogger = customLabel =>
	createLogger({
		format: combine(
			format.colorize(),
			label({ label: customLabel }),
			timestamp({ format: 'HH:mm:ss.SSS' }),
			formatting,
		),
		levels: customLevels.levels,
		transports: [new transports.Console()],
	})

const botLogger = createCustomLogger('Bot')
const debugLogger = createCustomLogger('Debug')
const lfgLogger = createCustomLogger('LFG')
const streamLinkLogger = createCustomLogger('StreamLink')

const logger = {
	bot: botLogger,
	debug: debugLogger,
	lfg: lfgLogger,
	sl: streamLinkLogger,
}

export default logger
