import Reddit from '../../../../src/commands/fun/Reddit';

import { runCommand, MockTranslateFunc } from '../../../testHelpers';

jest.mock('feed-read-parser', () => (url, callback) => {
	switch (url) {
	/* Forcing a return of an error */
	case 'https://www.reddit.com/r/FORCE_ERROR/.rss':
		return callback(new Error());

	/* /r/all */
	case 'https://www.reddit.com/r/all/.rss':
		return callback(null, [{
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
				name: 'all subreddits'
			}
		}]);

	// ???
	default:
		break;
	}
});

describe('Reddit command', () => {
	const RedditCommand = new Reddit({ t: MockTranslateFunc() });

	test('runs with no args and grabs a post from r/all', async () => {
		const result = await runCommand(RedditCommand, { args: [] });

		expect(result.message.channel.send.mock.results[0].value).toMatchSnapshot();
	});

	test('logs any errors from parsing Reddit feed', async () => {
		const result = await runCommand(RedditCommand, { args: [ '!reddit', 'FORCE_ERROR' ] });

		expect(result.message.channel.send.mock.results[0].value).toMatchSnapshot();
	});
});
