import { GameState } from './GameState.js';
import { Planet } from './Planet.js';
import { Ui } from './Ui.js';

class Game {
	ui
	gameState
	planets
	tickInterval
	autosaveTriggerCallback
	
	constructor(scenario) {
		this.ui = new Ui();
		this.gameState = new GameState(scenario.gameState);
		this.planets = scenario.planets.map(planetData => {
			let planet = new Planet(planetData);
			this.ui.addGraphic(planet);
			this.ui.addGraphic(planet.popover, false);
			planet.element.classList.add('clickable');
			planet.element.addEventListener('click', e => {
				planet.popover.show();
			});
			return planet;
		});
		this.ui.playPauseButton.addEventListener('click', e => this.togglePause());
		document.addEventListener('keyup', e => {
			if(e.key === ' ') {
				e.preventDefault();
				this.togglePause();
				return false;
			}
		});
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
		this.simulationTick();
		this.tickInterval = setInterval(this.simulationTick.bind(this), 1000);
		this.ui.playPauseButton.textContent = '❚ ❚';
		this.ui.playPauseButton.title = 'Pause';
	}
	
	simulationTick() {
		this.gameState.increment();
		this.ui.updateDateDisplay(this.gameState);
		for(const planet of this.planets) {
			planet.updateGraphic();
		}
		
		// trigger save
		if(this.gameState.month === 12 && this.autosaveTriggerCallback !== undefined) {
			this.autosaveTriggerCallback();
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
		saveState.timestamp = Date.now();
		return saveState;
	}
}

export { Game };