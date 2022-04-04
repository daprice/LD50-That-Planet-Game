import { scenario } from './scenario/scenario.js';
import { Game } from './classes/Game.js';
import { SaveManager } from './classes/SaveManager.js';

let theGame;

const introDialog = document.getElementById('introDialog');
const startButton = document.getElementById('startButton');

startButton.addEventListener('click', e => {
	theGame = new Game(scenario);
	introDialog.close();
	theGame.resume();
	theGame.autosaveTriggerCallback = () => { saveManager.save(theGame.getSaveState()) };
});

const saveManager = new SaveManager('planetGameSave');
saveManager.loadCallback = data => {
	theGame = new Game(data);
	theGame.resume();
	theGame.autosaveTriggerCallback = () => { saveManager.save(theGame.getSaveState()) };
};
saveManager.startNewCallback = () => {
	introDialog.showModal();
};

saveManager.checkAndPrompt();

document.getElementById('resetButton').addEventListener('click', e => {
	theGame.pause();
	theGame = new Game(scenario);
	theGame.resume();
	theGame.ui.lossDialog.close();
	theGame.autosaveTriggerCallback = () => { saveManager.save(theGame.getSaveState()) };
});