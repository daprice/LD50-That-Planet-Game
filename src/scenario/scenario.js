const scenario = {
	planets: [
		{
			name: 'Earth',
			x: 400,
			y: 400,
			size: 20,
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
			size: 13,
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
	],
}

export { scenario };