class FXBase {
	constructor(media, canvas, consts = {}, vars = {}) {
		// Setup
		this.media = media;
		this.canvas = canvas;
		this.consts = consts;
		this.vars = vars;
	}

	setVars(newVars) {
		const oldVars = this.vars;
		this.vars = Object.assign({}, this.vars, newVars);
		this.onVarsUpdated(oldVars);
	}

	onVarsUpdated(oldVars) {
	}

	async drawFrame(timestamp) {
		// Implement in subclasses
	}
}

const ValueTypes = {
	int: 0,
	string: 1,
	rgba: 2,
	float: 3,
	frame: 4,
}

export default FXBase;
export { ValueTypes };