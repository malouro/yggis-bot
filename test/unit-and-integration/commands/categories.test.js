import DebugCommands from '../../../src/commands/debug';

const DebugTestCases = DebugCommands.map(cmd => [cmd.name, 'debug', cmd]);

describe('Command Categories', () => {
	test.each([...DebugTestCases])(
		'the %sCommand has its category set to `%s`',
		(commandName, expectedCategory, CommandToTest) => {
			const ConstructedCommand = new CommandToTest();

			expect(ConstructedCommand.category).toBe(expectedCategory);
		}
	);
});
