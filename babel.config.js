module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: false,
				targets: {
					node: '8',
				},
			},
		],
	],
	plugins: ['@babel/plugin-proposal-class-properties'],
	env: {
		cjs: {
			presets: [
				[
					'@babel/preset-env',
					{
						targets: {
							node: 8,
						},
						useBuiltIns: 'usage',
					},
				],
			],
			plugins: ['@babel/plugin-transform-classes'],
		},
	},
};
