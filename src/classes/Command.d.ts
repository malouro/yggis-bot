/**
 * @todo at a later date
 * Flesh out and work out export from root index.
 */

interface CommandUsage {
	args?: Array<string>;
}

export declare class Command {
	constructor(options: {
		aliases?: Array<string>;
		category?: string;
		description?: string;
		disabled?: boolean;
		name: string;
		permLevel?: number;
		usage?: CommandUsage;
		t?: Function;
	});
}

export default Command;
