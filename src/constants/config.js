const commandPrefix = '!';
const statusMessage = `${commandPrefix}help`;
const statusMessageOptions = {
	type: 'WATCHING',
	url: '',
};
const commandCategories = {
	debug: {
		name: 'Debug',
		description: 'Commands that assist with debugging and support.',
	},
};

export default {
	commandCategories,
	commandPrefix,
	statusMessage,
	statusMessageOptions,
};
