import I18nError from './I18nError';

export default class MissingI18nConfigError extends I18nError {
	constructor() {
		super(
			[
				'Missing or invalid `translations` and/or `language` in i18n config.',
				'Please initialize the bot with a `translations` object containing language key-named translations, and the matching default `language` string.',
				'',
				'(Example)',
				'',
				'```',
				'translations = {',
				'  en-US: {',
				'    // ... translations & translation keys',
				'  }',
				'}',
				'language: "en-US"',
				'```',
			].join('\n')
		);

		this.name = 'MissingI18nConfig';
	}
}
