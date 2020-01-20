const LeagueOfLegends = {
	lol: {
		name: 'League of Legends',
		aliases: ['league', 'leg'],
		image: '// Placeholder //',
		gameModes: {
			aram: {
				name: 'ARAM - Howling Abyss',
				partySize: 5,
			},
		},
		defaultGameMode: 'aram',
	},
};

const OverWatch = {
	ow: {
		name: 'Overwatch',
		aliases: ['overwatch'],
		defaultGameMode: 'any',
	},
};

const games = {
	...LeagueOfLegends,
	...OverWatch,
};

export default games;
