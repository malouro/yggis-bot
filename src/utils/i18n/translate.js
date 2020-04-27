export default ({ defaultSpace, translations, language }) => (
	space = defaultSpace,
	subspace = null,
	key
) => {
	let output;

	try {
		if (subspace) {
			output = translations[language][space][subspace][key];
		} else {
			output = translations[language][space][key];
		}
	} catch (err) {
		/* eslint-disable-next-line no-console */
		console.warn(err);
		output = null;
	}

	return output;
};
