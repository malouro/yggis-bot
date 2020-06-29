import Aww from '../../../../src/commands/fun/Aww';

import { runCommand, MockTranslateFunc } from '../../../testHelpers';

jest.mock('feed-read-parser', () => (url, callback) => {
	switch (url) {
		// Modified result from fetching from r/aww .rss
		case 'https://www.reddit.com/r/aww/.rss':
			return callback(null, [
				{
					title: 'POST_TITLE',
					// Imitate XML that can return from feed-read-parser
					content: `<table> <tr><td> <a href="https://www.reddit.com/r/aww/comments/SOME_POST/">
			<img src="https://b.thumbs.redditmedia.com/8nS_rT2NxKhqMkxGCgO8_bLhYYRkqnKz_9hp2lHvP8Q.jpg"
			alt="🐱" title="🐱" /> </a> </td><td> &#32; submitted by &#32;
			<a href="https://www.reddit.com/user/SOME_AUTHOR"> /u/SOME_AUTHOR </a>
			<span><a href="https://i.redd.it/pqdffk5lsp751.jpg">[link]</a></span> &#32; <span>
			<a href="https://www.reddit.com/r/aww/comments/SOME_POST/">[comments]</a></span> </td></tr></table>`,
					published: 'SOME_DATE',
					author: '/u/SOME_AUTHOR',
					link: 'https://www.reddit.com/r/aww/comments/SOME_POST/',
					feed: {
						source: 'https://www.reddit.com/r/aww/.rss',
						link: 'https://www.reddit.com/r/aww/',
						name: 'aww',
					},
				},
			]);

		default:
			break;
	}
});

describe('Aww Command', () => {
	const AwwCommand = new Aww({ t: MockTranslateFunc() });

	test('returns a post from r/aww', async () => {
		const result = await runCommand(AwwCommand, { args: ['!aww']});

		expect(result.message.channel.send.mock.results[0].value).toMatchSnapshot();
	});
});
