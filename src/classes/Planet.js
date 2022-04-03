import { Popover } from './Popover.js';
import { PlanetaryResources } from './PlanetaryResources.js';

class Planet {
	name
	x
	y
	size
	
	element
	
	popover
	shipmentRequestCallback
	
	resources
	
	baseLayer
	earthLayer
	rossLayer
	centauriLayer
	water1Layer
	water2Layer
	toxinsLayer
	cloudLayer
	co2Layer
	nightLayer
	cities1Layer
	cities2Layer
	
	constructor({name, x, y, size=7, resources}) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.size = size;
		this.resources = new PlanetaryResources(resources);
		this.element = this.createGraphic();
		this.popover = this.createPopover();
	}
	
	createGraphic() {
		const xPos = this.x - this.size/2;
		const yPos = this.y - this.size/2;
		const width = this.size;
		const height = this.size;
		const graphicElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		
		const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
		titleElement.textContent = this.name;
		graphicElement.appendChild(titleElement);
		
		this.baseLayer = Planet.imageLayer(xPos, yPos, width, height, 'assets/Planet/Barren.svg');
		this.earthLayer = Planet.imageLayer(xPos, yPos, width, height, 'assets/Planet/Earth.svg');
		this.rossLayer = Planet.imageLayer(xPos, yPos, width, height, 'assets/Planet/Ross.svg');
		this.centauriLayer = Planet.imageLayer(xPos, yPos, width, height, 'assets/Planet/Centauri.svg');
		this.water1Layer = Planet.imageLayer(xPos, yPos, width, height, 'assets/Planet/Water 1.svg');
		this.water2Layer = Planet.imageLayer(xPos, yPos, width, height, 'assets/Planet/Water 2.svg');
		this.toxinsLayer = Planet.imageLayer(xPos, yPos, width, height, 'assets/Planet/Toxins.svg');
		this.cloudLayer = Planet.imageLayer(xPos, yPos, width, height, 'assets/Planet/Clouds.svg');
		this.co2Layer = Planet.imageLayer(xPos, yPos, width, height, 'assets/Planet/CO2 clouds.svg');
		this.nightLayer = Planet.imageLayer(xPos, yPos, width, height, 'assets/Planet/Night.svg');
		this.cities1Layer = Planet.imageLayer(xPos, yPos, width, height, 'assets/Planet/Cities 1.svg');
		this.cities2Layer = Planet.imageLayer(xPos, yPos, width, height, 'assets/Planet/Cities 2.svg');
		
		graphicElement.append(this.baseLayer, this.earthLayer, this.rossLayer, this.centauriLayer, this.water1Layer, this.water2Layer, this.toxinsLayer, this.cloudLayer, this.co2Layer, this.nightLayer, this.cities1Layer, this.cities2Layer);
		this.updateGraphic();
		
		return graphicElement;
	}
	
	updateSim() {
		const simMessages = [];
		
		/* !advance ecosystem */
		
		// flora growth and effects
		if(this.resources.earthPlants > 0) {
			// growth/decline
			if(this.resources.earthPlants < this.resources.water) {
				this.resources.earthPlants += this.resources.earthPlants * 0.017; // double every 10 years or something like that, up to the water limit
			} else if(this.resources.earthPlants > this.resources.water) {
				if(this.resources.earthPlants * 0.9 > this.resources.water) {
					simMessages.push(`Earth-like vegetation is dying off on ${this.name} due to lack of water!`);
				}
				this.resources.earthPlants -= 0.05; // lose 5% of possible plant population if there isn't enough water
			}
			this.resources.earthPlants = Math.min(1, Math.max(0, this.resources.earthPlants)); // keep within 0-1 range
			
			// effects
			// co2 -> o2
			const maxCo2Reduction = this.resources.earthPlants * 0.0001 / 120; // decrease by up to .01% every 10 years
			const actualCo2Reduction = Math.min(this.resources.co2, maxCo2Reduction);
			this.resources.co2 -= actualCo2Reduction;
			this.resources.oxygen += actualCo2Reduction;
			this.resources.oxygen = Math.min(1, this.resources.oxygen);
		}
		
		// population effects
		if(this.resources.population > 0) {
			// pop growth/decline
			const popRatio = Math.min(1, this.resources.population / 100000000); // fraction of one hundred million people which would be considered a "full" society
			const foodRatio = Math.min(1, this.resources.getAllPlantsTotal() * 1.25);
			const foodShortage = popRatio - foodRatio;
			// food shortage reduces population gradually: 1/20 of the unfed people go away each month
			// food surplus helps population increase faster than normal
			if(foodShortage > 0) {
				simMessages.push(`Food shortage on ${this.name}`);
				this.resources.population -= this.resources.population * foodShortage / 20;
			} else {
				this.resources.population += this.resources.population * (0.01/12 + (-foodShortage) * 0.05/12);
			}
			
			// insufficient oxygen quickly reduces population
			const oxygenShortage = 0.15 - this.resources.oxygen;
			if (oxygenShortage > 0) {
				simMessages.push(`${this.name} lacks sufficient oxygen for the survival of its population!`);
				this.resources.population -= this.resources.population * 0.5;
			}
			
			// too much CO2 reduces population
			const co2Excess = (this.resources.co2 - 0.0005) / 0.0005;
			if(co2Excess > 0) {
				simMessages.push(`Unhealthy carbon dioxide levels on ${this.name}!`);
				this.resources.population -= this.resources.population * 0.1 * co2Excess;
			}
			
			// too many toxins reduce population slowly
			this.resources.population -= this.resources.population * this.resources.toxins / 12;
			
			// lack of water kills
			if(this.resources.water === 0) {
				simMessages.push(`${this.name} is uninhabitable due to lack of surface water!`);
				this.resources.population -= Math.min(1000, this.resources.population * 0.8);
			}
			
			this.resources.population = Math.max(0, Math.floor(this.resources.population));
			
			// effects of population on planet
			// co2
			this.resources.co2 += this.resources.population / 1000000000 * 0.0001 / 240; // increase by .01% per billion per 20 years
			
			// toxins
			this.resources.toxins += this.resources.population / 1000000000 * 0.01 / 240;
		}
		
		/* !TODO: set launch button availability */
		
		return simMessages;
	}
	
	updateGraphic() {
		this.earthLayer.setAttributeNS(null, 'opacity', this.resources.earthPlants);
		this.rossLayer.setAttributeNS(null, 'opacity', this.resources.rossPlants);
		this.centauriLayer.setAttributeNS(null, 'opacity', this.resources.centauriPlants);
		let water1;
		let water2;
		if(this.resources.water > 0.5) {
			water1 = 1;
			water2 = this.resources.water;
		} else {
			water1 = this.resources.water * 2;
			water2 = 0;
		}
		this.water1Layer.setAttributeNS(null, 'opacity', water1);
		this.water2Layer.setAttributeNS(null, 'opacity', water2);
		this.toxinsLayer.setAttributeNS(null, 'opacity', Math.min(1, this.resources.toxins * 10));
		this.cloudLayer.setAttributeNS(null, 'opacity', Math.min(1, this.resources.oxygen * 4));
		this.co2Layer.setAttributeNS(null, 'opacity', Math.min(1, this.resources.co2 * 10));
		let pop1;
		let pop2;
		if(this.resources.population > 1000000000) {
			pop1 = 1;
			pop2 = 1;
		} else if(this.resources.population > 100000) {
			pop1 = 1;
			pop2 = 0;
		} else {
			pop1 = 0;
			pop2 = 0;
		}
		this.cities1Layer.setAttributeNS(null, 'opacity', pop1);
		this.cities2Layer.setAttributeNS(null, 'opacity', pop2);
		if(this.popover !== undefined) {
			this.resources.updatePopover(this.popover);
		}
	}
	
	static imageLayer(x, y, width, height, url) {
		const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
		image.setAttributeNS(null, 'x', x);
		image.setAttributeNS(null, 'y', y);
		image.setAttributeNS(null, 'width', width);
		image.setAttributeNS(null, 'height', height);
		image.setAttributeNS(null, 'href', url);
		return image;
	}
	
	createPopover() {
		const popover = new Popover({x: this.x - (280/2), y: this.y + this.size/2, width: 280, height: 400});
		popover.contentDiv.classList.add('ui','popover');
		
		const heading = document.createElement('h2');
		heading.classList.add('ui-heading');
		heading.textContent = this.name;
		
		const resourceTable = document.createElement('table');
		resourceTable.classList.add('ui-text');
		
		const popRow = document.createElement('tr');
		const popLabelCell = document.createElement('th');
		popLabelCell.textContent = 'Population';
		popover.popCell = document.createElement('td');
		popRow.append(popLabelCell, popover.popCell);
		resourceTable.append(popRow);
		
		const oxyRow = document.createElement('tr');
		const oxyLabelCell = document.createElement('th');
		oxyLabelCell.textContent = 'Oxygen';
		popover.oxyCell = document.createElement('td');
		oxyRow.append(oxyLabelCell, popover.oxyCell);
		resourceTable.append(oxyRow);
		
		const co2Row = document.createElement('tr');
		const co2LabelCell = document.createElement('th');
		co2LabelCell.textContent = 'CO';
		const co2LabelSubscript = document.createElement('sub');
		co2LabelSubscript.textContent = '2';
		co2LabelCell.appendChild(co2LabelSubscript);
		popover.co2Cell = document.createElement('td');
		co2Row.append(co2LabelCell, popover.co2Cell);
		resourceTable.append(co2Row);
		
		const waterRow = document.createElement('tr');
		const waterLabelCell = document.createElement('th');
		waterLabelCell.textContent = 'Surface water';
		popover.waterCell = document.createElement('td');
		waterRow.append(waterLabelCell, popover.waterCell);
		resourceTable.append(waterRow);
		
		const toxinsRow = document.createElement('tr');
		const toxinsLabelCell = document.createElement('th');
		toxinsLabelCell.textContent = 'Toxicity';
		popover.toxinsCell = document.createElement('td');
		toxinsRow.append(toxinsLabelCell, popover.toxinsCell);
		resourceTable.append(toxinsRow);
		
		const plantsRow = document.createElement('tr');
		const plantsLabelCell = document.createElement('th');
		plantsLabelCell.textContent = 'Flora';
		popover.plantsCell = document.createElement('td');
		plantsRow.append(plantsLabelCell, popover.plantsCell);
		resourceTable.append(plantsRow);
		
		const shipPopsButton = document.createElement('button');
		shipPopsButton.classList.add('ui-button');
		shipPopsButton.textContent = 'Launch settlers';
		shipPopsButton.addEventListener('click', e => {
			this.shipmentRequestCallback({sourceName: this.name, passengers: 1000});
		});
		popover.shipPopsButton = shipPopsButton;
				
		const shipSeedsButton = document.createElement('button');
		shipSeedsButton.classList.add('ui-button');
		shipSeedsButton.textContent = 'Launch seeds';
		shipSeedsButton.addEventListener('click', e => {
			this.shipmentRequestCallback({sourceName: this.name, earthSeeds: this.earthPlants, centauriSeeds: this.centauriPlants, rossSeeds: this.rossPlants});
		});
		popover.shipSeedsButton = shipSeedsButton;
		
		popover.contentDiv.append(popover.getCloseBox(), heading, resourceTable, shipPopsButton, shipSeedsButton);
		this.resources.updatePopover(popover);
		
		return popover;
	}
};

export { Planet };