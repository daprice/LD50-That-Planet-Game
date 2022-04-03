import { GameState } from './GameState.js';
import { Planet } from './Planet.js';
import { Ui } from './Ui.js';

class Game {
	ui
	gameState
	planets
	tickInterval
	
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
		return saveState;
	}
}

export { Game };