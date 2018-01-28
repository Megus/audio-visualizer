import FXBase from "../FXBase";

class SimpleSpectrum extends FXBase {
	getDefaultConsts() {
		return {
			barsCount: 128,		// Number of spectrum bars
		};
	}

	getDefaultVars() {
		return {
			scale: 1.5,			// Power multiplier
			height: 0.2,		// Spectrum height in percents of canvas height
			fallTime: 1.5,		// Seconds for a bar to fall to zero
		};
	}

	constructor(media, canvas, consts = {}, vars = {}) {
		super(media, canvas, consts, vars);

		const { barsCount } = this.consts;

		// Prepare arrays
		this.audio = media["mainAudio"]
		this.bufferLength = this.audio.fftSize / 2;
		this.dataArray = new Float32Array(this.bufferLength);
		this.bars = new Float32Array(barsCount);
		this.barWidth = canvas.width / barsCount;

		// Calculate FFT bins for bars
		const barBins = [];

		const maxFreq = this.audio.sampleRate / 2;
		let curBin = this.audio.freqToFFTBin(40);
		const maxBin = this.audio.freqToFFTBin(maxFreq * 0.9);
		const binMultiplier = (maxBin / curBin) ** (1.0 / barsCount);

		for (let c = 0; c <= barsCount; c += 1) {
			barBins.push(curBin);
			curBin *= binMultiplier;
		}

		this.barBins = barBins;
		this.lastTimestamp = 0;

		this.setupForVars();
	}

	setupForVars() {
		this.maxBarHeight = this.canvas.height * this.vars.height;
		this.powerMultiplier = this.canvas.height * this.vars.scale;
		// Trim bars height
		for (let c = 0; c < this.consts.barsCount; c += 1) {
			this.bars[c] = Math.min(this.maxBarHeight, this.bars[c]);
		}
	}

	drawFrame(timestamp) {
		const canvas = this.canvas;
		const canvasCtx = canvas.getContext("2d");

		this.audio.getFrequencyArray(timestamp, this.dataArray);

		let barHeight;
		let x = 0;

		for (let i = 0; i < this.consts.barsCount; i += 1) {
			// Calculate bar height
			if (Math.floor(this.barBins[i]) < Math.floor(this.barBins[i + 1])) {
				barHeight = 0;
				for (let c = Math.floor(this.barBins[i]); c < Math.floor(this.barBins[i + 1]); c += 1) {
					barHeight += this.dataArray[c];
				}
			} else {
				barHeight = this.dataArray[Math.floor(this.barBins[i])] +
					(this.barBins[i] - Math.floor(this.barBins[i])) *
					(this.dataArray[Math.floor(this.barBins[i]) + 1] - this.dataArray[Math.floor(this.barBins[i])]);
			}

			barHeight *= this.powerMultiplier;

			if (barHeight > this.maxBarHeight) {
				barHeight = this.maxBarHeight;
			}

			// Bars falling
			if (this.bars[i] < barHeight) {
				this.bars[i] = barHeight;
			} else {
				this.bars[i] =
					Math.max(this.bars[i] - this.maxBarHeight * Math.abs(timestamp - this.lastTimestamp) / this.vars.fallTime, barHeight);
			}

			canvasCtx.fillStyle = "rgb(255,50,50)";
			canvasCtx.fillRect(x, canvas.height - this.bars[i], this.barWidth - 1, this.bars[i]);

			x += this.barWidth;
		}

		this.lastTimestamp = timestamp;
	}
}

export default SimpleSpectrum;
