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
						corejs: {
							version: 3,
						},
					},
				],
			],
			plugins: ['@babel/plugin-transform-classes'],
		},
		test: {
			presets: [
				[
					'@babel/preset-env',
					{
						targets: {
							node: 'current',
						},
					},
				],
			],
			plugins: ['@babel/plugin-proposal-class-properties'],
		},
	},
};
