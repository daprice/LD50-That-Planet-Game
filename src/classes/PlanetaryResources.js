class PlanetaryResources {
	population
	oxygen
	co2
	water
	toxins // represents the percentage of the population that dies off each (turn? year?)
	earthPlants // converts co2 to oxygen, req water
	centauriPlants // converts toxins to water, req oxygen
	rossPlants // converts toxins to co2, req water
	
	static popFormatter = new Intl.NumberFormat(undefined, {signDisplay: 'never', notation: 'compact', compactDisplay: 'short'});
	static percentFormatter = new Intl.NumberFormat(undefined, {style: 'percent', maximumFractionDigits: 2, maximumSignificantDigits: 2, signDisplay: 'never'});
	
	constructor({population=0, oxygen=0, co2=0, water=0, toxins=0, earthPlants=0, centauriPlants=0, rossPlants=0}) {
		this.population = population;
		this.oxygen = oxygen;
		this.co2 = co2;
		this.water = water;
		this.toxins = toxins;
		this.earthPlants = earthPlants;
		this.centauriPlants = centauriPlants;
		this.rossPlants = rossPlants;
	}
	
	updatePopover(popover) {
		popover.popCell.textContent = this.constructor.popFormatter.format(this.population);
		popover.oxyCell.textContent = this.constructor.percentFormatter.format(this.oxygen);
		if (this.oxygen > 0.1) {
			popover.oxyCell.className = 'sufficientOxygen';
		} else {
			popover.oxyCell.className = 'insufficientResource';
		}
		popover.co2Cell.textContent = this.constructor.percentFormatter.format(this.co2);
		if (this.co2 < 0.0005) {
			popover.co2Cell.className = 'safeResource';
		} else if (this.co2 < 0.0007) {
			popover.co2Cell.className = 'warnResource';
		} else {
			popover.co2Cell.className = 'unsafeResource';
		}
		popover.waterCell.textContent = this.constructor.percentFormatter.format(this.water);
		if (this.water > .04) {
			popover.waterCell.className = 'sufficientWater';
		} else {
			popover.waterCell.className = 'insufficientResource';
		}
		popover.toxinsCell.textContent = this.constructor.percentFormatter.format(this.toxins);
		if (this.toxins < 0.02) {
			popover.toxinsCell.className = 'safeResource';
		} else if(this.toxins < 0.05) {
			popover.toxinsCell.className = 'warnResource';
		} else {
			popover.toxinsCell.className = 'unsafeResource';
		}
		
		if(this.earthPlants == 0 && this.centauriPlants == 0 && this.rossPlants == 0) {
			popover.plantsCell.textContent = 'None';
			popover.plantsCell.className = 'insufficientResource';
		} else if (this.earthPlants / this.centauriPlants > 1.5 && this.earthPlants / this.rossPlants > 1.5) {
			popover.plantsCell.textContent = 'Earth-like';
			popover.plantsCell.className = 'earthPlants';
		} else if (this.centauriPlants / this.earthPlants > 1.5 && this.centauriPlants / this.rossPlants > 1.5) {
			popover.plantsCell.textContent = 'Centauri-like';
			popover.plantsCell.className = 'centauriPlants';
		} else if (this.rossPlants / this.centauriPlants > 1.5 && this.rossPlants / this.earthPlants > 1.5) {
			popover.plantsCell.textContent = 'Ross-like';popover.plantsCell.className = 'rossPlants';
		} else {
			popover.plantsCell.textContent = 'Mixed';
			popover.plantsCell.className = '';
		}
	}
	
	getAllPlantsTotal() {
		return Math.min(this.earthPlants + this.centauriPlants + this.rossPlants);
	}
}

export { PlanetaryResources };