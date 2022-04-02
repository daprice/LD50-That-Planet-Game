import { Planet } from './Planet.js';
import { Ui } from './Ui.js';

class Game {
	constructor(scenario) {
		this.ui = new Ui();
		this.planets = scenario.planets.map(planetData => {
			let planet = new Planet(planetData);
			this.ui.addGraphic(planet);
			this.ui.addGraphic(planet.popover, false);
			planet.element.addEventListener('click', e => {
				planet.popover.show();
			});
		});
	}
}

export { Game };