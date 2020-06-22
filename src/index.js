import HelpCommand from './commands/debug/Help';
import PingCommand from './commands/debug/Ping';
import RedditCommand from './commands/fun/Reddit';

// -------------------------------------------------- //
// Classes & Structures

export { Bot, Command } from './classes';

// -------------------------------------------------- //
// Commands

// Individual Command Exports
export { HelpCommand, PingCommand, RedditCommand };

// Categorized/grouped Command Exports
export { default as DebugCommands } from './commands/debug';
export { default as FunCommands } from './commands/fun';

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
// I18n

export { default as defaultTranslations } from './i18n/en-US';
