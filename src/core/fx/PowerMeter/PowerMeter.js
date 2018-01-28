import FXBase from "../FXBase";

class PowerMeter extends FXBase {
	getDefaultVars() {
		return {
			scale: 1000,
		};
	}

	constructor(media, canvas, consts = {}, vars = {}) {
		super(media, canvas, consts, vars);
	}

	drawFrame(timestamp) {
		const canvas = this.canvas;
		const canvasCtx = canvas.getContext("2d");

		const power = this.media["mainAudio"].getPower(timestamp);

		canvasCtx.fillStyle = "rgb(255,50,50)";
		canvasCtx.fillRect(0, 0, power * this.vars.scale, 16);
	}
}

export default PowerMeter;
