import RendererBase from "../../RendererBase";
import { colorToCanvasFillStyle } from "../../RendererConvenience";

class SimplePower extends RendererBase {
	constructor(media, canvas, consts = {}, vars = {}) {
		super(media, canvas, consts, vars);
	}

	async render(timestamp) {
		const canvas = this.canvas;
		const canvasCtx = canvas.getContext("2d");
		canvasCtx.clearRect(0, 0, canvas.width, canvas.height);	// Can be optimized, btw

		const power = this.media["mainAudio"].getPower(timestamp);

		canvasCtx.fillStyle = colorToCanvasFillStyle(this.vars.color);
		canvasCtx.fillRect(
			this.vars.frame.x,
			this.vars.frame.y,
			Math.min(power * this.vars.scale, this.vars.frame.width),
			this.vars.frame.height);
	}
}

export default SimplePower;
