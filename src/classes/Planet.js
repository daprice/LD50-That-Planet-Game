import { Popover } from './Popover.js';
import { PlanetaryResources } from './PlanetaryResources.js';

class Planet {
	name
	x
	y
	size
	
	element
	
	popover
	
	resources
	
	constructor({name, x, y, size=7, resources}) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.size = size;
		this.resources = new PlanetaryResources(resources);
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
		const popover = new Popover({x: this.x - (280/2), y: this.y + this.size, width: 280, height: 400});
		popover.contentDiv.classList.add('ui','popover');
		
		const heading = document.createElement('h2');
		heading.classList.add('ui-heading');
		heading.textContent = this.name;
		
		const resourceTable = document.createElement('table');
		resourceTable.classList.add('ui-text');
		
		const popRow = document.createElement('tr');
		const popLabelCell = document.createElement('th');
		popLabelCell.textContent = 'Population';
		popover.popCell = document.createElement('td');
		popRow.append(popLabelCell, popover.popCell);
		resourceTable.append(popRow);
		
		const oxyRow = document.createElement('tr');
		const oxyLabelCell = document.createElement('th');
		oxyLabelCell.textContent = 'Oxygen';
		popover.oxyCell = document.createElement('td');
		oxyRow.append(oxyLabelCell, popover.oxyCell);
		resourceTable.append(oxyRow);
		
		const co2Row = document.createElement('tr');
		const co2LabelCell = document.createElement('th');
		co2LabelCell.textContent = 'CO';
		const co2LabelSubscript = document.createElement('sub');
		co2LabelSubscript.textContent = '2';
		co2LabelCell.appendChild(co2LabelSubscript);
		popover.co2Cell = document.createElement('td');
		co2Row.append(co2LabelCell, popover.co2Cell);
		resourceTable.append(co2Row);
		
		const waterRow = document.createElement('tr');
		const waterLabelCell = document.createElement('th');
		waterLabelCell.textContent = 'Surface water';
		popover.waterCell = document.createElement('td');
		waterRow.append(waterLabelCell, popover.waterCell);
		resourceTable.append(waterRow);
		
		const toxinsRow = document.createElement('tr');
		const toxinsLabelCell = document.createElement('th');
		toxinsLabelCell.textContent = 'Toxicity';
		popover.toxinsCell = document.createElement('td');
		toxinsRow.append(toxinsLabelCell, popover.toxinsCell);
		resourceTable.append(toxinsRow);
		
		const plantsRow = document.createElement('tr');
		const plantsLabelCell = document.createElement('th');
		plantsLabelCell.textContent = 'Flora';
		popover.plantsCell = document.createElement('td');
		plantsRow.append(plantsLabelCell, popover.plantsCell);
		resourceTable.append(plantsRow);
		
		popover.contentDiv.append(popover.getCloseBox(), heading, resourceTable);
		this.resources.updatePopover(popover);
		
		return popover;
	}
};

export { Planet };