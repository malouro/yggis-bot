import HelpCommand from './commands/debug/Help';
import PingCommand from './commands/debug/Ping';

// -------------------------------------------------- //
// Classes & Structures

export { Bot, Command } from './classes';

// -------------------------------------------------- //
// Commands

// Individual Command Exports
export { HelpCommand, PingCommand };

// Categorized/grouped Command Exports
export { default as DebugCommands } from './commands/debug';

// Default commands
export { default as DefaultCommands } from './commands';

// -------------------------------------------------- //
// Utilities

export { default as logger } from './utils/logger';

export { translate } from './utils/i18n';

export {
	canUseCommand,
	getArgumentsFromMessage,
	getCommandFromMessage,
} from './utils/commands';

export {
	CommandError,
	InvalidPropertyError,
	MissingPropertyError,
} from './utils/errors';
export { getCommands } from './utils/setup';
export { getUserPermLevel } from './utils/user';

// -------------------------------------------------- //
