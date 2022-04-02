class Planet {
	constructor({name, x, y, size=7, population}) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.size = size;
		this.population = population;
		this.graphic = this.createGraphic();
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
};

export { Planet };