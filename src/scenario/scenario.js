const scenario = {
	gameState: {
		year: 2082,
		month: 1,	
	},
	planets: [
		{
			name: 'Earth',
			x: 400,
			y: 400,
			size: 80,
			resources: {
				population: 7000000000,
				oxygen: 0.20,
				co2: 0.05,
				water: 0.80,
				toxins: 0.02,
				earthPlants: 0.8,
				centauriPlants: 0,
				rossPlants: 0,
			},
		},
		{
			name: 'Mars',
			x: 430,
			y: 480,
			size: 55,
			resources: {
				population: 0,
				oxygen: 0.01,
				co2: .96,
				water: .05,
				toxins: 0,
				earthPlants: 0,
				centauriPlants: 0,
				rossPlants: 0,
			},
		},
		{
			name: "Proxima b",
			x: 220,
			y: 260,
			size: 90,
			resources: {
				population: 0,
				oxygen: .15,
				co2: .10,
				water: .20,
				toxins: .30,
				earthPlants: 0,
				centauriPlants: .9,
				rossPlants: 0,
			},
		},
		{
			name: "Proxima d",
			x: 280,
			y: 210,
			size: 60,
			resources: {
				population: 0,
				oxygen: 0,
				co2: .20,
				water: .08,
				toxins: .15,
				earthPlants: 0,
				centauriPlants: 0,
				rossPlants: 0,
			},
		},
	],
}

export { scenario };