class GameState {
	month
	year
	
	constructor({year, month}) {
		this.month = month;
		this.year = year;
	}
	
	increment() {
		this.month += 1;
		if  (this.month > 12) {
			this.year += 1;
			this.month = 1;
		}
	}
}

export { GameState };