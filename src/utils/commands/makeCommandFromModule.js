export default function makeCommandFromModule(commandModule) {
	return {
		Name: commandModule.name,
		CommandConstructor: commandModule,
	}
}
