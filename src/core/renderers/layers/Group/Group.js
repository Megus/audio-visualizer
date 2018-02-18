import RendererBase from "../../RendererBase"
import { colorToCanvasFillStyle } from "../../RendererConvenience";

class Group extends RendererBase {
	constructor(media, canvas, consts = {}, vars = {}) {
		super(media, canvas, consts, vars);
	}

	onVarsUpdated(oldVars) {
	}

	async render(timestamp, dTimestamp) {
		const canvas = this.canvas;
		const canvasCtx = canvas.getContext("2d");
		const layers = this.consts.layers;

		canvasCtx.fillStyle = colorToCanvasFillStyle(this.vars.bgColor);
		canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

		await Promise.all(layers.map(async (layer) => {
			// Render layer
			layer.renderer.render(timestamp, dTimestamp);
			// Apply filters
			if (layer.filters) {
				layer.filters.forEach((filter) => filter.renderer.render(timestamp, dTimestamp));
			}
		}));
		layers.forEach((layer) => canvasCtx.drawImage(layer.renderer.canvas, 0, 0));
	}
}

export default Group;
