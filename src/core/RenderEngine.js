import fxClasses from "./fx";

class RenderEngine {
	constructor(project, width, height) {
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
			return new fxClasses[layer.fx](project.media, canvas, layer.consts, layer.vars);
		});
	}

	async drawFrame(canvas, timestamp) {
		const canvasCtx = canvas.getContext("2d");
		const offscreenCanvasCtx = this.canvas.getContext("2d");

		offscreenCanvasCtx.fillStyle = "rgb(0, 0, 0)";
		offscreenCanvasCtx.fillRect(0, 0, canvas.width, canvas.height);

		await Promise.all(this.layers.map(layer => layer.drawFrame(timestamp)));
		this.layers.forEach((layer) => { offscreenCanvasCtx.drawImage(layer.canvas, 0, 0); });

		canvasCtx.drawImage(this.canvas, 0, 0);
	}
}

export default RenderEngine;
