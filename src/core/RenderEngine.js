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
		this.realtime = realtime;

		this.setupLayer(project.mainGroup);
		console.log(project.mainGroup);

		this.oldTimestamp = 0;
	}

	setupLayer(layer, parentLayer) {
		const id = layer.id;
		if (renderers[id].type === "layer") {
			// Regular layer
			const canvas = document.createElement("canvas");
			canvas.width = this.width;
			canvas.height = this.height;
			const renderer = createRenderer(id, this.project,
				canvas, { ...layer.consts, realtime: this.realtime }, layer.vars);
			layer.renderer = renderer;
			if (layer.filters) {
				layer.filters.forEach((filter) => this.setupLayer(filter, layer));
			}
		} else if (renderers[id].type === "filter") {
			// Filter layer
			const renderer = createRenderer(id, this.project,
				parentLayer.renderer.canvas, { ...layer.consts, realtime: this.realtime}, layer.vars);
			layer.renderer = renderer;
		} else if (renderers[id].type === "group") {
			// Group layer
			const canvas = document.createElement("canvas");
			canvas.width = this.width;
			canvas.height = this.height;
			const renderer = createRenderer(id, this.project,
				canvas, { ...layer.consts, realtime: this.realtime, layers: layer.layers }, layer.vars);
			layer.renderer = renderer;
			layer.layers.forEach((subLayer) => this.setupLayer(subLayer, layer));
			if (layer.filters) {
				layer.filters.forEach((filter) => this.setupLayer(filter, layer));
			}
		}
	}

	// Handle automation
	applyAutomation(layer, timestamp) {
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
				const varType = renderers[layer.id].vars[autoVar].type;
				if (autoPosition < 0 ||
					layerAuto[idx + 1].easing === undefined ||
					typeInterpolators[varType] === undefined) {
					// Interpolation is not available for this point
					layer.renderer.setVars({[autoVar]: layerAuto[idx].value});
				} else {
					// Interpolate between pair of values
					const newValue = typeInterpolators[varType](
						layerAuto[idx].value,
						layerAuto[idx + 1].value,
						autoPosition,
						layerAuto[idx + 1].easing);
					layer.renderer.setVars({[autoVar]: newValue});
				}
			});
		}
		// If this layer has filters, apply automation to them
		if (layer.filters) {
			layer.filters.forEach((filter) => this.applyAutomation(filter, timestamp));
		}

		// If it's a group, apply automation to all its layers
		if (renderers[layer.id].type === "group") {
			layer.layers.forEach((layer) => this.applyAutomation(layer, timestamp));
		}
	}

	async drawFrame(canvas, timestamp) {
		if (!canvas) { return; }
		const project = this.project;
		const canvasCtx = canvas.getContext("2d");
		const dTimestamp = timestamp - this.oldTimestamp;

		// Apply automation
		this.applyAutomation(project.mainGroup, timestamp);
		// Render main group
		await project.mainGroup.renderer.render(timestamp, dTimestamp);
		// Draw the final image to target canvas
		canvasCtx.drawImage(project.mainGroup.renderer.canvas, 0, 0);

		this.oldTimestamp = timestamp;
	}
}

export default RenderEngine;
