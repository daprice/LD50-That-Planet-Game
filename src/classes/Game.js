import { GameState } from './GameState.js';
import { Planet } from './Planet.js';
import { Shipment } from './Shipment.js';
import { Ui } from './Ui.js';

class Game {
	ui
	gameState
	planets
	shipments
	tickInterval
	autosaveTriggerCallback
	pausedBeforeShipmentTargeting = false
	shipmentTargetingMode = false
	shipmentTargetingOptions
	
	constructor(scenario) {
		this.ui = new Ui();
		this.gameState = new GameState(scenario.gameState);
		this.planets = scenario.planets.map(planetData => {
			let planet = new Planet(planetData);
			this.ui.addGraphic(planet);
			this.ui.addGraphic(planet.popover, false);
			planet.element.classList.add('clickable');
			planet.element.addEventListener('click', e => {
				if(this.shipmentTargetingMode === true && this.shipmentTargetingOptions.sourceName !== planet.name) {
					this.shipmentTargeted(planet.name);
				} else {
					planet.popover.show();
				}
			});
			planet.shipmentRequestCallback = shipmentOptions => {
				this.shipmentRequest(shipmentOptions);
			};
			return planet;
		});
		this.shipments = scenario.shipments.map(shipmentData => {
			let shipment = new Shipment(shipmentData, this);
			this.ui.addGraphic(shipment);
			return shipment;
		});
		this.ui.playPauseButton.addEventListener('click', e => this.togglePause());
		document.addEventListener('keyup', e => {
			if(e.key === ' ') {
				e.preventDefault();
				this.togglePause();
				return false;
			}
		});
		this.ui.cancelShipmentButton.addEventListener('click', e => this.shipmentCanceled());
	}
	
	togglePause() {
		if(this.tickInterval === undefined) {
			this.resume();
		} else {
			this.pause();
		}
	}
	
	pause() {
		clearInterval(this.tickInterval);
		this.tickInterval = undefined;
		this.ui.playPauseButton.textContent = '▶︎';
		this.ui.playPauseButton.title = 'Play';
	}
	
	resume() {
		if(this.shipmentTargetingMode === true) {
			console.log('cant unpause because of shipment targeting mode')
			return;
		}
		this.simulationTick();
		this.tickInterval = setInterval(this.simulationTick.bind(this), 1000);
		this.ui.playPauseButton.textContent = '❚ ❚';
		this.ui.playPauseButton.title = 'Pause';
	}
	
	simulationTick() {
		this.gameState.increment();
		console.group/*Collapsed*/(`${this.gameState.year} ${this.gameState.month}`);
		
		// update graphics and simulation
		const simMessages = [];
		this.ui.updateDateDisplay(this.gameState);
		for(const planet of this.planets) {
			simMessages.push(...planet.updateSim());
			planet.updateGraphic();
		}
		for(const shipment of this.shipments) {
			simMessages.push(...shipment.updateSim());
			shipment.updateGraphic();
		}
		console.log(simMessages);
		
		console.groupEnd();
		
		// trigger save
		if(this.gameState.month === 12 && this.autosaveTriggerCallback !== undefined) {
			this.autosaveTriggerCallback();
		}
	}
	
	shipmentRequest(shipmentOptions) {
		this.pausedBeforeShipmentTargeting = (this.tickInterval === undefined);
		this.pause();
		this.shipmentTargetingOptions = shipmentOptions;
		this.shipmentTargetingMode = true;
		this.ui.beginShipmentTargeting();
	}
	
	shipmentTargeted(destinationName) {
		this.shipmentTargetingOptions.destinationName = destinationName;
		const shipment = new Shipment(this.shipmentTargetingOptions, this);
		shipment.loadUpShipment();
		this.shipmentTargetingMode = false;
		this.shipmentTargetingOptions = undefined;
		this.ui.endShipmentTargeting();
		this.shipmentAdded(shipment);
		if(!this.pausedBeforeShipmentTargeting) {
			this.resume();
		}
	}
	
	shipmentAdded(shipment) {
		this.shipments.push(shipment);
		this.ui.addGraphic(shipment);
	}
	
	shipmentCanceled() {
		this.ui.endShipmentTargeting();
		this.shipmentTargetingMode = false;
		this.shipmentTargetingOptions = undefined;
		if(!this.pausedBeforeShipmentTargeting) {
			this.resume();
		}
	}
	
	getSaveState() {
		const saveState = {};
		saveState.gameState = {
			year: this.gameState.year,
			month: this.gameState.month,
		};
		saveState.planets = this.planets.map(planet => {
			return {
				name: planet.name,
				x: planet.x,
				y: planet.y,
				size: planet.size,
				resources: planet.resources,
			};
		});
		saveState.shipments = this.shipments.map(shipment => {
			return {
				passengers: shipment.passengers,
				earthSeeds: shipment.earthSeeds,
				centauriSeeds: shipment.centauriSeeds,
				rossSeeds: shipment.rossSeeds,
				sourceName: shipment.sourceName,
				destinationName: shipment.destinationName,
				progress: shipment.progress,
			}
		});
		saveState.timestamp = Date.now();
		return saveState;
	}
	
	getPlanetByName(name) {
		return this.planets.find(planet => planet.name === name);
	}
}

export { Game };