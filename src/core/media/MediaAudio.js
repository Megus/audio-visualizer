import { KissFFT } from "../../3rdParty/kissfft/FFT";

class MediaAudio {
	constructor(audioBuffer, fftSize = 8192) {
		this.audioBuffer = audioBuffer;
		this.fftSize = fftSize;
		this.sampleRate = audioBuffer.sampleRate;
		this.fft = new KissFFT(fftSize);
		this.fftInArray = new Float32Array(fftSize * 2);
		this.audioLength = audioBuffer.length;
		this.channels = [];
		for (let c = 0; c < audioBuffer.numberOfChannels; c += 1) {
			this.channels.push(audioBuffer.getChannelData(c));
		}
	}

	//stop() {
	//	this.fft.dispose();
	//}

	getFrequencyArray(timestamp, dataArray) {
		const fft = this.fft;
		const sampleStart = this.timestampToSample(timestamp) - (this.fftSize / 2);

		let i = 0;
		for (let c = sampleStart; c < sampleStart + this.fftSize; c += 1) {
			this.fftInArray[i] = this.avgSampleAt(c);
			i += 2;
		}

		const out = fft.forward(this.fftInArray);

		for (let c = 0; c < this.fftSize; c += 1) {
			dataArray[c] = Math.sqrt((out[c * 2] * out[c * 2]) +
				(out[(c * 2) + 1] * out[(c * 2) + 1])) / this.fftSize;
		}
	}

	getPower(timestamp) {
		let power = 0.0;
		let sample = 0;
		const sampleStart = this.timestampToSample(timestamp);
		for (let c = sampleStart; c < sampleStart + this.fftSize; c += 1) {
			sample = this.avgSampleAt(c);
			power += sample * sample;
		}
		return Math.sqrt(power / this.fftSize);
	}

	getSamples(timestamp, count) {

	}

	// Public utility functions
	freqToFFTBin(freq) {
		return Math.floor((freq * this.fftSize) / this.sampleRate);
	}

	timestampToSample(timestamp) {
		return Math.floor(timestamp * this.sampleRate);
	}

	avgSampleAt(sample) {
		if (sample < 0 || sample >= this.audioLength) {
			return 0.0;
		}
		let value = 0;
		for (let c = 0; c < this.channels.length; c += 1) {
			value += this.channels[c][sample];
		}
		return value / this.channels.length;
	}
}

export default MediaAudio;
