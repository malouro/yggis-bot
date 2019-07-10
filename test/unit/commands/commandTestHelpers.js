export async function runCommand(command, baseOptions, overrides) {
	await command.run(Object.assign({}, baseOptions, overrides))
}
