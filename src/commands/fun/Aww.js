import RedditCommand from './Reddit';
import Command from '../../classes/Command';

export default class Aww extends Command {
	constructor({ t } = { t: () => null }) {
		super({
			name: 'Aww',
			category: 'fun',
			description: 'Grab a cute & cuddly post from the /r/aww subreddit.',
		});

		this.t = t;
		this.translationKey = 'reddit';
		this.translationKeyForDescriptions = 'aww';

		this.name =
			this.t('COMMANDS', this.translationKeyForDescriptions, 'name') ||
			this.name;
		this.description =
			this.t('COMMANDS', this.translationKeyForDescriptions, 'description') ||
			this.description;

		this.subreddit = 'aww';
	}

	action({ message, logger }) {
		const fireRedditAction = RedditCommand.prototype.action.bind(this, {
			message,
			logger,
		});

		fireRedditAction();
	}
}
