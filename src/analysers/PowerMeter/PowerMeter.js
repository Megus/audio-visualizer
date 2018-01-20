import AnalyserBase from "../AnalyserBase"

class PowerMeter extends AnalyserBase {
	getDefaultVars() {
		return {
			scale: 1000,
		}
	}

	constructor(dataProvider, canvas, consts = {}, vars = {}) {
		super(dataProvider, canvas, consts, vars)
	}

	drawFrame(timestamp) {
				let canvas = this.canvas
				let canvasCtx = canvas.getContext("2d");

				const power = this.provider.getPower(timestamp)

				canvasCtx.fillStyle = 'rgb(255,50,50)';
				canvasCtx.fillRect(0, 0, power * this.vars.scale, 16);
	}
}

export default PowerMeter