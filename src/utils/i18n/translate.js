import { MissingI18nConfigError } from '../errors';

export default ({ defaultSpace = 'COMMON', translations, language }) => {
	if (!translations || !language) {
		throw new MissingI18nConfigError();
	}

	return (space = defaultSpace, subspace, key) => {
		let output;

		try {
			if (subspace) {
				output = translations[language][space][subspace][key];
			} else {
				output = translations[language][space][key];
			}
		} catch (err) {
			/* eslint-disable-next-line no-console */
			console.error(err);
			output = null;
		}

		return output;
	};
};
