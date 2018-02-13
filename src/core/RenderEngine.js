import { createRenderer, renderers } from "./renderers";
import { ValueTypes } from "./renderers/RendererBase"
import interpolators from "./interpolators"

const typeInterpolators = {
	[ValueTypes.frame]: (a, b, t, easing) => {
		const i = interpolators[easing];
		return {
			x: i(a.x, b.x, t),
			y: i(a.y, b.y, t),
			width: i(a.width, b.width, t),
			height: i(a.height, b.height, t)
		}
	}
}


class RenderEngine {
	constructor(project, width, height, realtime = true) {
		this.project = project;
		this.width = width;
		this.height = height;

		this.canvas = document.createElement("canvas");
		this.canvas.width = width;
		this.canvas.height = height;

		project.layers.forEach((layer) => {
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const renderer = createRenderer(layer.id, project,
				canvas, { ...layer.consts, realtime: realtime }, layer.vars);
			layer.renderer = renderer;
		});

		this.oldTimestamp = 0;
	}

	async drawFrame(canvas, timestamp) {
		if (!canvas) { return; }
		const canvasCtx = canvas.getContext("2d");
		const offscreenCanvasCtx = this.canvas.getContext("2d");

		offscreenCanvasCtx.fillStyle = "rgb(0, 0, 0)";
		offscreenCanvasCtx.fillRect(0, 0, canvas.width, canvas.height);

		const dTimestamp = timestamp - this.oldTimestamp;

		await Promise.all(this.project.layers.map(async (layer) => {
			// Handle automation
			if (layer.automation) {
				// TODO: Optimize this code, it's a temporary quick implementation
				// The slowest part here is the constant scanning through automation lists
				// Another optimization is to combine all var changes in a single setVars call if there are
				// several automation lanes for a single layer
				Object.keys(layer.automation).forEach((autoVar) => {
					const layerAuto = layer.automation[autoVar];
					let idx = -1;
					let autoPosition = -1;
					// Find the pair of automation points for this timestamp
					for (let c = 0; c < layerAuto.length - 1; c++) {
						if (timestamp >= layerAuto[c].timestamp && timestamp < layerAuto[c + 1].timestamp) {
							idx = c;
							autoPosition = (timestamp - layerAuto[c].timestamp) /
								(layerAuto[c + 1].timestamp - layerAuto[c].timestamp);
							break;
						}
					}
					// Didn't find the pair? That means we reached the end
					if (idx === -1) {
						idx = layerAuto.length - 1;
					}
					if (autoPosition < 0) {
						// Start or it's the end of automation points
						layer.renderer.setVars({[autoVar]: layerAuto[idx].value});
					} else {
						// Interpolate between pair of values
						const varType = renderers[layer.id].vars[autoVar].type;
						const newValue = typeInterpolators[varType](
							layerAuto[idx].value,
							layerAuto[idx + 1].value,
							autoPosition,
							layerAuto[idx + 1].easing || "linear");
						layer.renderer.setVars({[autoVar]: newValue});
					}
				});
			}

			// Render layer
			layer.renderer.render(timestamp, dTimestamp);
		}));
		this.project.layers.forEach((layer) => { offscreenCanvasCtx.drawImage(layer.renderer.canvas, 0, 0); });

		canvasCtx.drawImage(this.canvas, 0, 0);
		this.oldTimestamp = timestamp;
	}
}

export default RenderEngine;
