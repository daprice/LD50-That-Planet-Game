import { GameState } from './GameState.js';
import { Planet } from './Planet.js';
import { PlanetaryResources } from './PlanetaryResources.js';
import { Shipment } from './Shipment.js';
import { Ui } from './Ui.js';
import { EventLog } from './EventLog.js';

class Game {
	ui
	gameState
	planets
	shipments
	tickInterval
	speed = 1000 // real time per simulation tick
	minSpeed = 8000
	maxSpeed = 125
	autosaveTriggerCallback
	pausedBeforeShipmentTargeting = false
	pausedBeforeEventLog = false
	eventLogOpen = false
	eventLogger = new EventLog()
	shipmentTargetingMode = false
	shipmentTargetingOptions
	
	constructor(scenario) {
		this.ui = new Ui();
		this.gameState = new GameState(scenario.gameState);
		this.planets = scenario.planets.map(planetData => {
			const planet = new Planet(planetData);
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
			this.ui.addGraphic(shipment, true, 0);
			return shipment;
		});
		this.ui.playPauseButton.addEventListener('click', e => this.togglePause());
		this.ui.speedDownButton.addEventListener('click', e => this.speedDown());
		this.ui.speedUpButton.addEventListener('click', e => this.speedUp());
		document.addEventListener('keyup', e => {
			if(e.key === ' ') {
				e.preventDefault();
				this.togglePause();
				return false;
			} else if (e.key === '-') {
				e.preventDefault();
				this.speedDown();
				return false;
			} else if (e.key === '+' || e.key === '=') {
				e.preventDefault();
				this.speedUp();
				return false;
			}
		});
		this.ui.cancelShipmentButton.addEventListener('click', e => this.shipmentCanceled());
		this.ui.eventLogButton.addEventListener('click', e => {
			this.openEventLog();
		});
		this.ui.eventLogCloseButton.addEventListener('click', e => this.closeEventLog());
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
		this.ui.playPauseButton.title = 'Play (shortcut: spacebar)';
		this.ui.setPaused();
	}
	
	resume() {
		if(this.shipmentTargetingMode === true || this.eventLogOpen === true) {
			console.log('cant unpause because of a mode/modal')
			return;
		}
		this.simulationTick();
		this.tickInterval = setInterval(this.simulationTick.bind(this), this.speed);
		this.ui.playPauseButton.textContent = '❚ ❚';
		this.ui.playPauseButton.title = 'Pause (shortcut: spacebar)';
		this.ui.unsetPaused();
	}
	
	speedUp() {
		if(this.speed > this.maxSpeed) {
			clearInterval(this.tickInterval);
			this.speed /= 2;
			if(this.tickInterval !== undefined) this.tickInterval = setInterval(this.simulationTick.bind(this), this.speed);
			if(this.speed <= this.maxSpeed) {
				this.ui.speedUpButton.disabled = true;
			}
			this.ui.speedDownButton.disabled = false;
		}
	}
	
	speedDown() {
		if(this.speed < this.minSpeed) {
			clearInterval(this.tickInterval);
			this.speed *= 2;
			if(this.tickInterval !== undefined) this.tickInterval = setInterval(this.simulationTick.bind(this), this.speed);
			if(this.speed >= this.minSpeed) {
				this.ui.speedDownButton.disabled = true;
			}
			this.ui.speedUpButton.disabled = false;
		}
	}
	
	openEventLog() {
		this.pausedBeforeEventLog = (this.tickInterval === undefined);
		this.eventLogOpen = true;
		this.pause();
		this.eventLogger.presentLog();
		this.ui.eventLogDialog.showModal();
	}
	
	closeEventLog() {
		this.ui.eventLogDialog.close();
		this.eventLogOpen = false;
		if(!this.pausedBeforeEventLog) {
			this.resume();
		}
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
		this.eventLogger.addEvents(this.gameState.year, this.gameState.month, simMessages);
		
		console.groupEnd();
		
		// trigger save
		if(this.gameState.month === 12 && this.autosaveTriggerCallback !== undefined) {
			this.autosaveTriggerCallback();
			this.eventLogger.addEvents(this.gameState.year, this.gameState.month, ['Autosave completed.']);
		}
		
		// census
		if(this.gameState.month === 1) {
			let totalPop = 0;
			for(const planet of this.planets) {
				totalPop += planet.resources.population;
			}
			for(const shipment of this.shipments) {
				totalPop += shipment.passengers;
			}
			this.eventLogger.addEvents(this.gameState.year, this.gameState.month, [`There are ${PlanetaryResources.longPopFormatter.format(totalPop)} of your species alive.`]);
			console.log('census complete');
			if (totalPop <= 0) {
				this.pause();
				this.ui.lossDialog.showModal();
			}
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
		this.ui.addGraphic(shipment, true, 0);
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