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
	parent
	
	sourcePlanet
	destinationPlanet
	distance
	
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
		
		const distX = this.destinationPlanet.x - this.sourcePlanet.x;
		const distY = this.destinationPlanet.y - this.sourcePlanet.y;
		this.distance = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
	}
	
	loadUpShipment() {
		this.sourcePlanet.resources.population -= this.passengers;
	}
	
	finishShipment() {
		this.destinationPlanet.resources.population += this.passengers;
		this.destinationPlanet.resources.earthPlants += this.earthSeeds;
		this.destinationPlanet.resources.centauriPlants += this.centauriSeeds;
		this.destinationPlanet.resources.rossPlants += this.rossSeeds;
		this.parent.removeChild(this.element);
	}
	
	updateSim() {
		const simMessages = [];
		
		const movedDistance = 1;
		this.progress += movedDistance / this.distance;
		if(this.progress >= 1) {
			this.finishShipment();
			simMessages.push(`The starship from ${this.sourceName} has arrived at ${this.destinationName}`);
		}
		
		return simMessages;
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