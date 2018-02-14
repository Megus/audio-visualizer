import { createRenderer } from "./renderers";

class RenderEngine {
	constructor(project, width, height, realtime = true) {
		this.project = project;
		this.width = width;
		this.height = height;

		this.canvas = document.createElement("canvas");
		this.canvas.width = width;
		this.canvas.height = height;
		this.layers = project.layers.map((layer) => {
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			return createRenderer(layer.id, project, canvas, { ...layer.consts, realtime: realtime }, layer.vars);
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

		await Promise.all(this.layers.map(layer => layer.render(timestamp, dTimestamp)));
		this.layers.forEach((layer) => { offscreenCanvasCtx.drawImage(layer.canvas, 0, 0); });

		canvasCtx.drawImage(this.canvas, 0, 0);
		this.oldTimestamp = timestamp;
	}
}

export default RenderEngine;
