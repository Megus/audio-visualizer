import FXBase from "../FXBase";

class PowerMeter extends FXBase {
	getDefaultVars() {
		return {
			scale: 1000,
			color: "#FFFFFFFF"
		};
	}

	constructor(media, canvas, consts = {}, vars = {}) {
		super(media, canvas, consts, vars);
	}

	async drawFrame(timestamp) {
		const canvas = this.canvas;
		const canvasCtx = canvas.getContext("2d");

		canvasCtx.clearRect(0, 0, canvas.width, canvas.height);	// Can be optimized, btw

		const power = this.media["mainAudio"].getPower(timestamp);

		canvasCtx.fillStyle = this.vars.color;
		canvasCtx.fillRect(
			this.vars.frame.x,
			this.vars.frame.y,
			Math.min(power * this.vars.scale, this.vars.frame.width),
			this.vars.frame.height);
	}
}

export default PowerMeter;
