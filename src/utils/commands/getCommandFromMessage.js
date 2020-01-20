export default function getCommandFromMessage(args, config) {
	return args[0].replace(config.commandPrefix, '').toLocaleLowerCase();
}
