class Popover {
	x
	y
	width
	height
	element
	parent
	contentDiv
	
	constructor({x, y, width=50, height=40}) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.element = this.createGraphic();
	}
	
	createGraphic() {
		const popoverElement = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
		popoverElement.setAttributeNS(null, 'x', this.x);
		popoverElement.setAttributeNS(null, 'y', this.y + 10);
		popoverElement.setAttributeNS(null, 'width', 50);
		popoverElement.setAttributeNS(null, 'height', 40);
		const contentElement = document.createElement('div');
		popoverElement.appendChild(contentElement);
		this.contentDiv = contentElement;
		return popoverElement;
	}
	
	show() {
		this.parent.appendChild(this.element);
	}
	
	hide() {
		this.parent.removeChild(this.element);
	}
}

export { Popover };