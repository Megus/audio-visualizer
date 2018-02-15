import RendererBase from "../../RendererBase";
import { colorToCanvasFillStyle } from "../../RendererConvenience";

class SimpleWave extends RendererBase {
	constructor(media, canvas, consts = {}, vars = {}) {
		super(media, canvas, consts, vars);
	}

	async render(timestamp) {
		const canvas = this.canvas;
		const canvasCtx = canvas.getContext("2d");

		canvasCtx.clearRect(0, 0, canvas.width, canvas.height);	// Can be optimized, btw

		const samples = this.media["mainAudio"].getMonoSamples(timestamp, this.vars.frame.width / 2);

		canvasCtx.strokeStyle = colorToCanvasFillStyle(this.vars.color);
		canvasCtx.lineWidth = this.vars.lineWidth;
		const centerY = this.vars.frame.y + this.vars.frame.height / 2;
		canvasCtx.beginPath();
		canvasCtx.moveTo(this.vars.frame.x, centerY);
		for (let c = 0; c < samples.length; c++) {
			canvasCtx.lineTo(this.vars.frame.x + c * 2, centerY + samples[c] * this.vars.frame.height / 2);
		}
		canvasCtx.stroke();
	}
}

export default SimpleWave;
