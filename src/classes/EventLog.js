import { Ui } from './Ui.js';

class EventLog {
	years = []
	container
	
	constructor() {
		this.container = document.querySelector('#logContainer');
	}
	
	addEvents(year, month, events) {
		const lastYear = this.years[this.years.length - 1];
		if(lastYear !== undefined && lastYear.year === year) {
			const lastMonth = lastYear.months[lastYear.months.length - 1];
			if(lastMonth !== undefined && lastMonth.month === month) {
				lastMonth.events.push(...events);
			} else {
				lastYear.months.push(new Month(month, events));
			}
		} else {
			this.years.push(new Year(year, [new Month(month, events)]));
		}
	}
	
	presentLog() {
		const lastDecade = this.years.slice(-10);
		const elements = [];
		for (const year of lastDecade) {
			const yearLabel = document.createElement('h2');
			yearLabel.textContent = `${year.year}`;
			const monthElements = [];
			for(const month of year.months) {
				const monthLabel = document.createElement('h3');
				monthLabel.textContent = Ui.monthNames[month.month];
				const eventList = document.createElement('ul');
				for(const event of month.events) {
					const eventElement = document.createElement('li');
					eventElement.textContent = event;
					eventList.append(eventElement);
				}
				monthElements.push(eventList, monthLabel);
			}
			// monthElements.reverse();
			elements.push(...monthElements);
			elements.push(yearLabel);
		}
		elements.reverse();
		this.container.replaceChildren(...elements);
	}
}

class Year {
	year
	months = []
	
	constructor(year, months) {
		this.year = year;
		this.months = months;
	}
}

class Month {
	month
	events = []
	
	constructor(month, events) {
		this.month = month;
		this.events = events;
	}
}

export { EventLog }