import FXBase from "../FXBase";

class PowerMeter extends FXBase {
	getDefaultVars() {
		return {
			scale: 1000,
		};
	}

	constructor(dataProvider, canvas, consts = {}, vars = {}) {
		super(dataProvider, canvas, consts, vars);
	}

	drawFrame(timestamp) {
		const canvas = this.canvas;
		const canvasCtx = canvas.getContext("2d");

		const power = this.provider.getPower(timestamp);

		canvasCtx.fillStyle = "rgb(255,50,50)";
		canvasCtx.fillRect(0, 0, power * this.vars.scale, 16);
	}
}

export default PowerMeter;
