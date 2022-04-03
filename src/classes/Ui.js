class Ui {
	gameArea
	dateElement
	
	static monthNames = ['Zeroary', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	
	constructor() {
		this.gameArea = document.querySelector('#game');
		const dateContainer = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
		dateContainer.setAttributeNS(null, 'x', 300);
		dateContainer.setAttributeNS(null, 'y', 8);
		dateContainer.setAttributeNS(null, 'width', 200);
		dateContainer.setAttributeNS(null, 'height', 60);
		this.dateElement = document.createElement('p');
		this.dateElement.classList.add('ui-text', 'centeredText');
		dateContainer.appendChild(this.dateElement);
		this.gameArea.appendChild(dateContainer);
	}
	
	addGraphic(graphicObject, visible = true) {
		if(visible) {
			this.gameArea.appendChild(graphicObject.element);
		}
		graphicObject.parent = this.gameArea;
	}
	
	updateDateDisplay(state) {
		this.dateElement.textContent = `${Ui.monthNames[state.month]} ${state.year}`;
	}
}

export { Ui };