import { scenario } from './scenario/scenario.js';
import { Game } from './classes/Game.js';

let theGame = new Game(scenario);

function save() {
	const state = JSON.stringify(theGame.getSaveState());
	window.localStorage.setItem('planetGameSave', state);
}

function load() {
	theGame.pause();
	const state = JSON.parse(window.localStorage.getItem('planetGameSave'));
	theGame = new Game(state);
}