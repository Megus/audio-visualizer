class FXBase {
	constructor(media, canvas, consts = {}, vars = {}) {
		// Setup
		this.media = media;
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

	async drawFrame(timestamp) {
		// Implement in subclasses
	}
}

export default FXBase;
