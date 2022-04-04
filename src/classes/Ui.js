class Ui {
	gameArea
	layers = []
	dateElement
	playPauseButton
	shipmentTargetingInterface
	cancelShipmentButton
	
	static monthNames = ['Zeroary', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	
	constructor(layers=3) {
		this.gameArea = document.querySelector('#game');
		this.gameArea.appendChild(this.createDateElements());
		this.gameArea.appendChild(this.createPlayPauseButton());
		this.shipmentTargetingInterface = this.createShipmentTargetingInterface();
		for (let l = 0; l < layers; l++) {
			const layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			this.layers.push(layer);
			this.gameArea.appendChild(layer);
		}
	}
	
	addGraphic(graphicObject, visible = true, layerIndex = 1) {
		const layer = this.layers[layerIndex];
		if(visible) {
			layer.appendChild(graphicObject.element);
		}
		graphicObject.parent = layer;
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
	
	createShipmentTargetingInterface() {
		const container = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
		container.setAttributeNS(null, 'x', 200);
		container.setAttributeNS(null, 'y', 700);
		container.setAttributeNS(null, 'width', 400);
		container.setAttributeNS(null, 'height', 100);
		const div = document.createElement('div');
		div.classList.add('ui', 'centeredText');
		const h1 = document.createElement('h1');
		h1.classList.add('ui-heading');
		h1.textContent = 'Choose a destination';
		this.cancelShipmentButton = document.createElement('button');
		this.cancelShipmentButton.classList.add('ui-button');
		this.cancelShipmentButton.textContent = 'Cancel launch';
		div.append(h1, this.cancelShipmentButton);
		container.appendChild(div);
		return container;
	}
	
	beginShipmentTargeting() {
		this.gameArea.appendChild(this.shipmentTargetingInterface);
		this.gameArea.classList.add('targeting-mode');
		this.playPauseButton.disabled = true;
	}
	
	endShipmentTargeting() {
		this.gameArea.removeChild(this.shipmentTargetingInterface);
		this.gameArea.classList.remove('targeting-mode');
		this.playPauseButton.disabled = false;
	}
	
	setPaused() {
		this.gameArea.classList.add('paused');
		this.gameArea.classList.remove('playing');
	}
	
	unsetPaused() {
		this.gameArea.classList.remove('paused');
		this.gameArea.classList.add('playing');
	}
}

export { Ui };