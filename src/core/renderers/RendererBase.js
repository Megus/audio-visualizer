class RendererBase {
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

	async render(timestamp, dTimestamp) {
		// Implement in subclasses
	}
}

const ValueTypes = {
	// TODO: Validators?
	int: () => { return 1; },
	string: () => { return 2; },
	color: () => { return 3; },
	float: () => { return 4; },
	frame: () => { return 5; },
	media: () => { return 6; },
	arrayOf: (type) => { return 7; },
}

export default RendererBase;
export { ValueTypes };