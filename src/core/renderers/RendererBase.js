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
	int: () => {},
	string: () => {},
	color: () => {},
	float: () => {},
	frame: () => {},
	media: () => {},
	arrayOf: (type) => {},
}

export default RendererBase;
export { ValueTypes };