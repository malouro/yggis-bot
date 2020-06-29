import ParseFeed from 'feed-read-parser';

import Command from '../../classes/Command';

export default class Reddit extends Command {
	constructor({ t } = { t: () => null }) {
		super({
			name: 'Reddit',
			category: 'fun',
			description: 'Grab a random Reddit post from a specific subreddit.',
			usage: {
				args: [
					{
						name: 'subreddit',
						description: 'The subreddit to grab a post from.',
						chainable: false,
						type: 'string',
					},
				],
			},
		});

		this.t = t;
		this.translationKey = 'reddit';

		this.name = this.t('COMMANDS', this.translationKey, 'name') || this.name;
		this.description =
			this.t('COMMANDS', this.translationKey, 'description') ||
			this.description;
	}

	preAction({ args }) {
		this.subreddit = args[1] ? args[1].toLocaleLowerCase() : 'all';
		return null;
	}

	action({ message, logger }) {
		const { subreddit } = this;
		const redditUrl = `https://www.reddit.com/r/${subreddit}/.rss`;
		let messageContent = '';

		ParseFeed(redditUrl, (error, articles) => {
			if (error) {
				return logger.debug.log({
					level: 'error',
					message: error,
				});
			}

			if (articles.length === 0) {
				const invalidMessage =
					(typeof this.t(
						'COMMANDS',
						this.translationKey,
						'invalidSubreddit'
					) === 'function' &&
						this.t(
							'COMMANDS',
							this.translationKey,
							'invalidSubreddit'
						)(subreddit)) ||
					`Oops! The subreddit \`/r/${subreddit}\` is either empty or non-existent.`;

				return message.reply(invalidMessage);
			}

			const links = [];
			const titles = [];
			const authors = [];
			const getImage = content => {
				const regex = /<a .*?href="(.*?)">/gi;
				const matches = [...content.matchAll(regex)];

				return matches[2][1].includes('i.redd.it') ?
					matches[2][1] :
					matches[3][1];
			};

			articles.forEach(article => {
				titles.push(article.title);
				authors.push(article.author);
				links.push(article.link);
			});

			const rng = Math.floor(Math.random() * links.length);

			messageContent +=
				(typeof this.t('COMMANDS', this.translationKey, 'postedByText') ===
					'function' &&
					this.t(
						'COMMANDS',
						this.translationKey,
						'postedByText'
					)(titles[rng], authors[rng])) ||
				`**${titles[rng]}** posted by ${authors[rng]}`;

			if (articles[rng].content.includes('img src')) {
				const image = getImage(articles[rng].content);

				messageContent += `\n${image}`;
			}

			messageContent += `\n<${links[rng]}>`;

			return message.channel.send(messageContent);
		});
	}
}
