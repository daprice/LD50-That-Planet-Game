class Shipment {
	passengers
	earthSeeds
	centauriSeeds
	rossSeeds
	sourceName
	destinationName
	progress
	gameWorld
	
	element
	
	sourcePlanet
	destinationPlanet
	
	constructor({passengers=0, earthSeeds=0, centauriSeeds=0, rossSeeds=0, sourceName, destinationName, progress=0}, gameWorld) {
		this.passengers = passengers;
		this.earthSeeds = earthSeeds;
		this.centauriSeeds = centauriSeeds;
		this.rossSeeds = rossSeeds;
		this.sourceName = sourceName;
		this.destinationName = destinationName;
		this.progress = progress;
		this.gameWorld = gameWorld;
		this.element = this.createGraphic();
		
		this.sourcePlanet = this.gameWorld.getPlanetByName(this.sourceName);
		this.destinationPlanet = this.gameWorld.getPlanetByName(this.destinationName);
	}
	
	loadUpShipment() {
		this.sourcePlanet.resources.population -= this.passengers;
	}
	
	updateSim() {
		// TODO: progress the shipment
	}
	
	createGraphic() {
		// TODO: this
		console.error('lol unimplemented');
	}
	
	updateGraphic() {
		// TODO: this
		console.error('lol unimplemented');
	}
}

export { Shipment };