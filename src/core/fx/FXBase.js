class FXBase {
	constructor(dataProvider, canvas, consts = {}, vars = {}) {
		// Setup
		this.provider = dataProvider;
		this.canvas = canvas;
		this.consts = Object.assign({}, this.getDefaultConsts(), consts);
		this.vars = Object.assign({}, this.getDefaultVars(), vars);
	}

	getDefaultConsts() {
		return {};
	}

	getDefaultVars() {
		return {};
	}

	setVars(newVars) {
		Object.assign(this.vars, newVars);
	}

	drawFrame(timestamp) {
		// Implement in subclasses
	}
}

export default FXBase;
