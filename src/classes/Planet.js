import { Popover } from './Popover.js';

class Planet {
	constructor({name, x, y, size=7, population}) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.size = size;
		this.population = population;
		this.element = this.createGraphic();
		this.popover = this.createPopover();
	}
	
	createGraphic() {
		const graphicElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		circle.setAttributeNS(null, 'cx', this.x);
		circle.setAttributeNS(null, 'cy', this.y);
		circle.setAttributeNS(null, 'r', this.size);
		graphicElement.appendChild(circle);
		return graphicElement;
	}
	
	createPopover() {
		const popover = new Popover({x: this.x, y: this.y + 10});
		popover.contentDiv.classList.add('ui');
		const popoverContent = document.createElement('h2');
		popoverContent.classList.add('ui-heading');
		popoverContent.textContent = this.name;
		popover.contentDiv.appendChild(popoverContent);
		return popover;
	}
};

export { Planet };