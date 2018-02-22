import RendererBase from "../../RendererBase";
import { colorToCanvasFillStyle } from "../../RendererConvenience";

class SimpleSpectrum extends RendererBase {
	constructor(media, canvas, consts = {}, vars = {}) {
		super(media, canvas, consts, vars);

		const { barsCount } = this.consts;

		// Prepare arrays
		this.audio = media["mainAudio"];
		this.bufferLength = this.audio.fftSize / 2;
		this.dataArray = new Float32Array(this.bufferLength);
		this.bars = new Float32Array(barsCount);

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

		this.setupForVars();
	}

	setupForVars() {
		this.powerMultiplier = this.vars.frame.height * this.vars.scale;
		this.barWidth = this.vars.frame.width / this.consts.barsCount;
		// Trim bars height
		for (let c = 0; c < this.consts.barsCount; c += 1) {
			this.bars[c] = Math.min(this.vars.frame.height, this.bars[c]);
		}
	}

	onVarsUpdted(oldVars) {
		this.setupForVars();
	}

	async render(timestamp, dTimestamp) {
		const canvas = this.canvas;
		const canvasCtx = canvas.getContext("2d");
		canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

		this.audio.getFrequencyArray(timestamp, this.dataArray);

		let barHeight;
		let x = this.vars.frame.x;

		canvasCtx.fillStyle = colorToCanvasFillStyle(this.vars.color);
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

			barHeight = Math.min(this.vars.frame.height, barHeight * this.powerMultiplier);

			// Bars falling
			if (this.bars[i] < barHeight) {
				this.bars[i] = barHeight;
			} else {
				this.bars[i] = Math.max(
					this.bars[i] - this.vars.frame.height * Math.abs(dTimestamp) / this.vars.fallTime, barHeight);
			}

			canvasCtx.fillRect(x, this.vars.frame.y + this.vars.frame.height - this.bars[i],
				this.barWidth - 0.5, this.bars[i]);

			x += this.barWidth;
		}
	}
}

export default SimpleSpectrum;
