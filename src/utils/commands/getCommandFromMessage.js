/**
 * @todo
 * 	Make the main argument an actual Discord Message object
 *
 * @function getCommandFromMessage
 * 	@param
 */
export default function getCommandFromMessage(args, config) {
	return args[0].replace(config.commandPrefix, '').toLocaleLowerCase();
}
