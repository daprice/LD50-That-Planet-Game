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
	
	constructor({passengers=0, earthSeeds=0, centauriSeeds=0, rossSeeds=0, sourceName, destinationName, progress=0}, gameWorld) {
		this.passengers = passengers;
		this.earthSeeds = earthSeeds;
		this.centauriSeeds = centauriSeeds;
		this.rossSeeds = rossSeeds;
		this.source = sourceName;
		this.destination = destinationName;
		this.progress = progress;
		this.gameWorld = gameWorld;
		this.element = this.createGraphic();
	}
	
	loadUpShipment() {
		// TODO: take the resources to be shipped away from the source planet if necessary
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