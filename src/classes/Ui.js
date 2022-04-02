class Ui {
	constructor() {
		this.gameArea = document.querySelector('#game');
	}
	
	addGraphic(graphicElement) {
		this.gameArea.appendChild(graphicElement);
	}
}

export { Ui };