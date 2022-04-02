class Popover {
	x
	y
	width
	height
	
	element
	parent
	
	contentDiv
	
	constructor({x, y, width=200, height=100}) {
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
		popoverElement.setAttributeNS(null, 'width', this.width);
		popoverElement.setAttributeNS(null, 'height', this.height);
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
	
	getCloseBox() {
		const closeBox = document.createElement('button');
		closeBox.classList.add('popover-close', 'ui-button');
		closeBox.addEventListener('click', e => this.hide());
		closeBox.textContent = '×';
		closeBox.title = 'Close';
		return closeBox;
	}
}

export { Popover };