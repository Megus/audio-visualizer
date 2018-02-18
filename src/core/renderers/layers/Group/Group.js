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
		canvasCtx.globalAlpha = 1.0;
		canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
		canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

		await Promise.all(layers.map(async (layer) => {
			// Render layer
			if (layer.renderer.vars.on) {
				await layer.renderer.render(timestamp, dTimestamp);
			}
			// Apply filters
			if (layer.filters) {
				for (let c = 0; c < layer.filters.length; c++) {
					const filter = layer.filters[c];
					if (filter.renderer.vars.on) {
						await filter.renderer.render(timestamp, dTimestamp);
					}
				}
			}
		}));
		layers.forEach((layer) => {
			if (layer.renderer.vars.on) {
				canvasCtx.globalAlpha = layer.renderer.vars.alpha;
				canvasCtx.drawImage(layer.renderer.canvas, 0, 0);
			}
		});
	}
}

export default Group;
