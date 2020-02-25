module.exports = {
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
	env: {
		esm: {
			presets: [
				[
					'@babel/preset-env',
					{
						modules: false,
						targets: {
							node: 'current',
						},
					},
				],
			],
		},
		cjs: {
			presets: [
				[
					'@babel/preset-env',
					{
						modules: 'commonjs',
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
		},
		umd: {
			presets: [
				[
					'@babel/preset-env',
					{
						targets: {
							ie: 11,
							browsers: 'last 2 versions',
						},
						useBuiltIns: 'entry',
					},
				],
			],
			plugins: [
				'@babel/plugin-transform-classes',
				'@babel/plugin-transform-async-to-generator',
			],
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
