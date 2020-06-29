import Reddit from '../../../../src/commands/fun/Reddit';

import { runCommand, MockTranslateFunc } from '../../../testHelpers';

jest.mock('feed-read-parser', () => (url, callback) => {
	switch (url) {
		// Force a return of an error
		case 'https://www.reddit.com/r/force_error/.rss':
			return callback('error');

		// empty subreddit
		case 'https://www.reddit.com/r/empty/.rss':
			return callback(null, []);

		// r/all
		case 'https://www.reddit.com/r/all/.rss':
			// Slightly modified result from fetching from the r/all .rss
			return callback(null, [
				{
					title: 'POST_TITLE',
					// Imitate XML that can return from feed-read-parser
					content: `<table> <tr><td> <a href="https://www.reddit.com/r/pics/comments/SOME_POST/">
			<img src="https://b.thumbs.redditmedia.com/yjc-IUtDVd5xHZkeMjJ043eDEDpBMx0CGSbrQ9CsbGk.jpg"
			alt="💪" title="💪" /> </a> </td><td> &#32; submitted by &#32;
			<a href="https://www.reddit.com/user/SOME_AUTHOR"> /u/SOME_AUTHOR </a>
			&#32; to &#32; <a href="https://www.reddit.com/r/all/"> r/all </a> <br/>
			<span><a href="https://i.redd.it/wqd0hx650k651.jpg">[link]</a></span> &#32; <span>
			<a href="https://www.reddit.com/r/all/comments/SOME_POST/">[comments]</a></span> </td></tr></table>`,
					published: 'SOME_DATE',
					author: '/u/SOME_AUTHOR',
					link: 'https://www.reddit.com/r/all/comments/SOME_POST/',
					feed: {
						source: 'https://www.reddit.com/r/all/.rss',
						link: 'https://www.reddit.com/r/all/',
						name: 'all subreddits',
					},
				},
			]);

		case 'https://www.reddit.com/r/image/.rss':
			return callback(null, [
				{
					content: `
					<img src="https://an.image.src/picture.jpg" />
					<a href="first:link"></a>
					<a href="second:link"></a>
					<a href="https://i.redd.it/this-is-an-image.jpg"></a>
					`
				}
			]);

		case 'https://www.reddit.com/r/no-image/.rss':
			return callback(null, [
				{
					content: `
						<table>
							<span>No image</span>
							<a hef="just"></a>
							<a hef="some"></a>
							<a hef="links"></a>
						</table>
					`
				}
			]);

		default:
			break;
	}
});

describe('Reddit command', () => {
	const RedditCommand = new Reddit({ t: MockTranslateFunc() });

	/**
	 * @description
	 * - Runs the Reddit command, with a given set of option overrides
	 * - Use an array for `args` to list out arguments to be used in the command execution
	 * @returns Jest Mock results to the mocked out Discord `message.channel.send()`
	 */
	const runRedditCommand = async({
		args = ['!reddit'],
		...options
	} = {}) => {
		const {
			message: {
				channel: { send: mockedSend },
				reply: mockedReply,
			},
		} = await runCommand(RedditCommand, {
			args,
			...options
		});

		return (
			mockedSend.mock.results.length > 0 ||
			mockedReply.mock.results.length > 0
		) ?
			({
				sendResult:
					mockedSend.mock.results[0] &&
					mockedSend.mock.results[0].value,
				replyResult:
					mockedReply.mock.results[0] &&
					mockedReply.mock.results[0].value,
			}) :
			null;
	};

	test('runs with no args and grabs a post from r/all', async () => {
		const { sendResult } = await runRedditCommand();

		expect(sendResult).toMatchSnapshot();
	});

	test('handles posts with and without images', async () => {
		const { sendResult: resultWithImage} = await runRedditCommand({ args: ['!reddit', 'image']});
		const { sendResult: resultWithoutImage } = await runRedditCommand({ args: ['!reddit', 'no-image']});

		expect(resultWithImage).toMatchSnapshot();
		expect(resultWithoutImage).toMatchSnapshot();
	});

	test('logs any errors from parsing Reddit feed', async () => {
		const logger = {
			debug: {
				log: jest.fn(),
			},
		};
		const result = await runCommand(RedditCommand, {
			args: ['!reddit', 'force_error'],
			logger,
		});

		expect(result.message.channel.send).not.toHaveBeenCalled();
		expect(logger.debug.log).toHaveBeenCalled();
	});

	test('empty subreddit', async () => {
		const { replyResult } = await runRedditCommand({ args: ['!reddit', 'empty'] });

		expect(replyResult).toMatchSnapshot();
	});
});
