import { createRenderer, renderers } from "./renderers";
import { ValueTypes } from "./renderers/RendererBase";
import { colorToCanvasFillStyle } from "./renderers/RendererConvenience";
import easings from "./easings";

function ease(a, b, t, easing) {
	return a + (b - a) * easings[easing](t);
}

function trim(v, min, max) {
	if (v < min) return min;
	if (v > max) return max;
	return v;
}

const typeInterpolators = {
	[ValueTypes.float]: (a, b, t, easing) => {
		return ease(a, b, t, easing);
	},
	[ValueTypes.int]: (a, b, t, easing) => {
		return Math.floor(ease(a, b, t, easing));
	},
	[ValueTypes.color]: (a, b, t, easing) => {
		return {
			r: trim(ease(a.r, b.r, t, easing), 0, 255),
			g: trim(ease(a.g, b.g, t, easing), 0, 255),
			b: trim(ease(a.b, b.b, t, easing), 0, 255),
			a: trim(ease(a.a === undefined ? 1 : a.a, b.a === undefined ? 1 : b.a, t, easing), 0, 1)
		}
	},
	[ValueTypes.frame]: (a, b, t, easing) => {
		return {
			x: ease(a.x, b.x, t, easing),
			y: ease(a.y, b.y, t, easing),
			width: ease(a.width, b.width, t, easing),
			height: ease(a.height, b.height, t, easing)
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
			if (layer.filters) {
				layer.filters.forEach((filter) => {
					const renderer = createRenderer(filter.id, project,
						canvas, { ...filter.consts, realtime: realtime}, filter.vars);
					filter.renderer = renderer;
				});
			}
		});

		this.oldTimestamp = 0;
	}

	// Handle automation
	applyAutomation(layer, timestamp) {
		// TODO: Handle filter automation
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
				if (autoPosition < 0 || layerAuto[idx + 1].easing === undefined) {
					// Start or it's the end of automation points
					layer.renderer.setVars({[autoVar]: layerAuto[idx].value});
				} else {
					// Interpolate between pair of values
					const varType = renderers[layer.id].vars[autoVar].type;
					const newValue = typeInterpolators[varType](
						layerAuto[idx].value,
						layerAuto[idx + 1].value,
						autoPosition,
						layerAuto[idx + 1].easing);
					layer.renderer.setVars({[autoVar]: newValue});
				}
			});
		}
	}

	async drawFrame(canvas, timestamp) {
		if (!canvas) { return; }
		const canvasCtx = canvas.getContext("2d");
		const offscreenCanvasCtx = this.canvas.getContext("2d");

		offscreenCanvasCtx.fillStyle = colorToCanvasFillStyle(this.project.backgroundColor);
		offscreenCanvasCtx.fillRect(0, 0, canvas.width, canvas.height);

		const dTimestamp = timestamp - this.oldTimestamp;

		await Promise.all(this.project.layers.map(async (layer) => {
			// Render layer
			this.applyAutomation(layer, timestamp);
			layer.renderer.render(timestamp, dTimestamp);
			// Apply filters
			if (layer.filters) {
				layer.filters.forEach((filter) => {
					this.applyAutomation(filter, timestamp);
					filter.renderer.render(timestamp, dTimestamp);
				});
			}
		}));
		this.project.layers.forEach((layer) => { offscreenCanvasCtx.drawImage(layer.renderer.canvas, 0, 0); });

		canvasCtx.drawImage(this.canvas, 0, 0);
		this.oldTimestamp = timestamp;
	}
}

export default RenderEngine;
