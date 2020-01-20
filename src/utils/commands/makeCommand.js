export default function makeCommand(commandModule) {
	return {
		Name: commandModule.name,
		CommandConstructor: commandModule,
	};
}
