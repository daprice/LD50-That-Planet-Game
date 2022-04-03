class SaveManager {
	saveName
	
	loadedData
	
	loadDialog = document.getElementById('continueSaveDialog');
	errorDialog = document.getElementById('loadErrorDialog');
	lastSaveDateField = document.querySelector('.saveDate');
	
	loadCallback
	startNewCallback
	
	static dateFormatter = new Intl.DateTimeFormat();
	
	constructor(name = 'savedGame') {
		this.saveName = name;
		document.getElementById('revertSave').addEventListener('click', e => {
			this.newGame();
		});
		document.getElementById('loadSave').addEventListener('click', e => {
			this.loadGame();
		});
		document.getElementById('newGameFromError').addEventListener('click', e => {
			this.newGame();
		})
	}
	
	checkAndPrompt() {
		const saved = window.localStorage.getItem(this.saveName);
		if (saved === null) {
			this.startNewCallback();
		} else {
			this.loadedData = JSON.parse(saved);
			this.loadPrompt();
		}
	}
	
	loadPrompt() {
		const saveDate = new Date(this.loadedData.timestamp);
		this.lastSaveDateField.textContent = SaveManager.dateFormatter.format(saveDate);
		this.loadDialog.showModal();
	}
	
	loadGame() {
		try {
			this.loadCallback(this.loadedData);
		} catch(error) {
			this.loadErrorPrompt();
			console.error(error);
		} finally {
			this.loadDialog.close();
		}
	}
	
	loadErrorPrompt() {
		this.errorDialog.showModal();
	}
	
	newGame() {
		this.loadDialog.close();
		this.errorDialog.close();
		this.startNewCallback();
	}
	
	save(stateObject) {
		window.localStorage.setItem(this.saveName, JSON.stringify(stateObject));
		console.info(`game saved as "${this.saveName}"`);
	}
}

export { SaveManager };