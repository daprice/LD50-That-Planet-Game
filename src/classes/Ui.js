class Ui {
	gameArea
	dateElement
	playPauseButton
	
	static monthNames = ['Zeroary', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	
	constructor() {
		this.gameArea = document.querySelector('#game');
		this.gameArea.appendChild(this.createDateElements());
		this.gameArea.appendChild(this.createPlayPauseButton());
	}
	
	addGraphic(graphicObject, visible = true) {
		if(visible) {
			this.gameArea.appendChild(graphicObject.element);
		}
		graphicObject.parent = this.gameArea;
	}
	
	createDateElements() {
		const dateContainer = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
		dateContainer.setAttributeNS(null, 'x', 300);
		dateContainer.setAttributeNS(null, 'y', 8);
		dateContainer.setAttributeNS(null, 'width', 200);
		dateContainer.setAttributeNS(null, 'height', 60);
		this.dateElement = document.createElement('p');
		this.dateElement.classList.add('ui-text', 'centeredText', 'ui');
		dateContainer.appendChild(this.dateElement);
		return dateContainer;
	}
	
	updateDateDisplay(state) {
		this.dateElement.textContent = `${Ui.monthNames[state.month]} ${state.year}`;
	}
	
	createPlayPauseButton() {
		const container = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
		container.setAttributeNS(null, 'x', 700);
		container.setAttributeNS(null, 'y', 8);
		container.setAttributeNS(null, 'width', 100);
		container.setAttributeNS(null, 'height', 60);
		const div = document.createElement('div');
		div.classList.add('rightAlignedText', 'ui', 'ui-text');
		this.playPauseButton = document.createElement('button');
		this.playPauseButton.classList.add('floating-button');
		div.appendChild(this.playPauseButton);
		container.appendChild(div);
		return container;
	}
}

export { Ui };