export default ({ defaultSpace, translations, language }) => (
	space = defaultSpace,
	subspace = null,
	key
) =>
	subspace
		? translations[language][space][subspace][key]
		: translations[language][space][key];
