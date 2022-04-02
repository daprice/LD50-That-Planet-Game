class Ui {
	constructor() {
		this.gameArea = document.querySelector('#game');
	}
	
	addGraphic(graphicObject, visible = true) {
		if(visible) {
			this.gameArea.appendChild(graphicObject.element);
		}
		graphicObject.parent = this.gameArea;
	}
}

export { Ui };