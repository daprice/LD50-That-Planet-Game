import { Planet } from './Planet.js';

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
	filledPath
	starshipImage
	
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
		
		this.sourcePlanet = this.gameWorld.getPlanetByName(this.sourceName);
		this.destinationPlanet = this.gameWorld.getPlanetByName(this.destinationName);
		
		const distX = this.destinationPlanet.x - this.sourcePlanet.x;
		const distY = this.destinationPlanet.y - this.sourcePlanet.y;
		this.distance = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
		
		this.element = this.createGraphic();
		
		if (this.progress < 1) {
			this.sourcePlanet.currentlyShipping = true;
		}
	}
	
	loadUpShipment() {
		this.sourcePlanet.resources.population -= this.passengers;
	}
	
	finishShipment() {
		this.sourcePlanet.currentlyShipping = false;
		this.destinationPlanet.resources.population += this.passengers;
		this.destinationPlanet.resources.earthPlants += this.earthSeeds;
		this.destinationPlanet.resources.centauriPlants += this.centauriSeeds;
		this.destinationPlanet.resources.rossPlants += this.rossSeeds;
	}
	
	updateSim() {
		const simMessages = [];
		
		if(this.progress < 1) {
			const movedDistance = 2;
			this.progress += movedDistance / this.distance;
			if(this.progress >= 1) {
				this.progress = 1;
				this.finishShipment();
				simMessages.push(`The starship from ${this.sourceName} arrived at ${this.destinationName}.`);
			}
		}
		
		return simMessages;
	}
	
	createGraphic() {
		const container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		
		const tracedPath = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		tracedPath.setAttributeNS(null, 'x1', this.destinationPlanet.x);
		tracedPath.setAttributeNS(null, 'y1', this.destinationPlanet.y);
		tracedPath.setAttributeNS(null, 'x2', this.sourcePlanet.x);
		tracedPath.setAttributeNS(null, 'y2', this.sourcePlanet.y);
		tracedPath.classList.add('shipmentPath', 'tracedPath');
		
		const filledPath = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		filledPath.setAttributeNS(null, 'x2', this.destinationPlanet.x);
		filledPath.setAttributeNS(null, 'y2', this.destinationPlanet.y);
		filledPath.setAttributeNS(null, 'x1', this.sourcePlanet.x);
		filledPath.setAttributeNS(null, 'y1', this.sourcePlanet.y);
		filledPath.classList.add('shipmentPath', 'filledPath');
		filledPath.setAttributeNS(null, 'stroke-dasharray', `${this.distance} ${this.distance}`);
		filledPath.setAttributeNS(null, 'stroke-dashoffset', this.distance - (this.distance * this.progress));
		this.filledPath = filledPath;
		
		
		const pos = this.getCurrentPosition();
		const angle = this.getAngle();
		const starshipGraphic = Planet.imageLayer(pos.x - 15, pos.y - 15, 30, 30, 'assets/starship.svg');
		starshipGraphic.setAttributeNS(null, 'transform', `rotate(${angle}, ${pos.x - 15}, ${pos.y - 15})`);
		this.starshipImage = starshipGraphic;
		
		container.append(tracedPath, filledPath);
		this.gameWorld.ui.layers[2].appendChild(starshipGraphic);
		
		return container;
	}
	
	getCurrentPosition() {
		const distX = (this.destinationPlanet.x - this.sourcePlanet.x) * this.progress;
		const distY = (this.destinationPlanet.y - this.sourcePlanet.y) * this.progress;
		return {x: this.sourcePlanet.x + distX, y: this.sourcePlanet.y + distY};
	}
	
	getAngle() {
		const distX = (this.destinationPlanet.x - this.sourcePlanet.x) * this.progress;
		const distY = (this.destinationPlanet.y - this.sourcePlanet.y) * this.progress;
		return Math.atan2(distY, distX) * (180 / Math.PI) + 90;
	}
	
	updateGraphic() {
		this.filledPath.setAttributeNS(null, 'stroke-dashoffset', this.distance - (this.distance * this.progress));
		
		const pos = this.getCurrentPosition();
		const angle = this.getAngle();
		this.starshipImage.setAttributeNS(null, 'x', pos.x - 15);
		this.starshipImage.setAttributeNS(null, 'y', pos.y - 15);
		this.starshipImage.setAttributeNS(null, 'transform', `rotate(${angle}, ${pos.x}, ${pos.y})`);
		
		if (this.progress >= 1) {
			this.element.setAttributeNS(null, 'opacity', 0);
			this.starshipImage.setAttributeNS(null, 'opacity', 0);
		}
	}
}

export { Shipment };