export default function getArgumentsFromMessage(message) {
	if (!message || !message.content) {
		return [];
	}
	return message.content.split(/\s+/);
}
