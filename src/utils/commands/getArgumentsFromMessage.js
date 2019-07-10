export default function getArgumentsFromMessage(message) {
	return message.content.split(/\s+/)
}
