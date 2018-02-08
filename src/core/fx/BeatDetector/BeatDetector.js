import FXBase from "../FXBase";

class BeatDetector extends FXBase {
	getDefaultConsts() {
		return {
			freqLow: 20,
			freqHigh: 150,
		};
	}

	getDefaultVars() {
		return {
			threshold: 0.03,
			fallTime: 1,
			gap: 0.2,
		};
	}

	constructor(media, canvas, consts = {}, vars = {}) {
		super(media, canvas, consts, vars);
		this.audio = media["mainAudio"]
		this.lowBin = this.audio.freqToFFTBin(this.consts.freqLow);
		this.highBin = this.audio.freqToFFTBin(this.consts.freqHigh);

		this.bufferLength = this.audio.fftSize / 2;
		this.dataArray = new Float32Array(this.bufferLength);
		this.level = 0;
		this.lastTimestamp = 0;
		this.gapCounter = 0;
		this.lastBeatPower = 0;
	}

	async drawFrame(timestamp) {
		const canvas = this.canvas;
		const canvasCtx = canvas.getContext("2d");

		this.audio.getFrequencyArray(timestamp, this.dataArray);
		let power = 0;
		for (let c = this.lowBin; c <= this.highBin; c += 1) {
			power += this.dataArray[c] * this.dataArray[c];
		}
		power = Math.sqrt(power / ((this.highBin - this.lowBin) + 1));

		if (this.gapCounter === 0 && power > this.vars.threshold && power > this.lastBeatPower) {
			this.level = 200;
			this.lastBeatPower = power;
			this.gapCounter = this.vars.gap;
		}
		if (power <= this.vars.threshold) {
			this.lastBeatPower = 0;
		}

		canvasCtx.fillStyle = "rgb(255,255,255)";
		canvasCtx.fillRect(0, 18, this.level, 16);

		if (power > this.vars.threshold) {
			canvasCtx.fillStyle = "rgb(255,255,50)";
		} else {
			canvasCtx.fillStyle = "rgb(255,50,50)";
		}
		canvasCtx.fillRect(0, 36, power * 4000, 16);

		const timeDiff = Math.abs(timestamp - this.lastTimestamp);
		this.level -= 200 * timeDiff;
		this.gapCounter -= timeDiff;
		if (this.gapCounter <= 0) {
			this.gapCounter = 0;
		}
		this.lastTimestamp = timestamp;
	}
}

export default BeatDetector;
