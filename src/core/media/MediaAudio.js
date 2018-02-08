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

	/**
	 * Get frequency powers at the specific time to pre-allocated data array.
	 * @param timestamp - audio time in seconds
	 * @param dataArray - Float32Array with elements count equal to fftSize
	 */
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

	/**
	 * Get audio power at the specific time.
	 * @param timestamp - audio time in seconds
	 * @return audio power
	 */
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

	/**
	 * Get samples from the track, converted to mono.
	 * @param timestamp - audio time in seconds
	 * @param counts - number of samples to get
	 * @return Float32Array with samples
	 */
	getMonoSamples(timestamp, count) {
		const sampleStart = this.timestampToSample(timestamp);
		const samples = new Float32Array(count);
		for (let c = sampleStart; c < sampleStart + count; c++) {
			samples[c] = this.avgSampleAt(c);
		}
		return samples;
	}


	// Public utility functions

	/**
	 * Convert frequency to FFT bin number
	 * @param freq — frequency in Herz
	 * @return FFT bin number (index in frequency array)
	 */
	freqToFFTBin(freq) {
		return Math.floor((freq * this.fftSize) / this.sampleRate);
	}

	/**
	 * Convert timestamp to sample number
	 * @param timestamp - audio time in seconds
	 * @return sample number
	 */
	timestampToSample(timestamp) {
		return Math.floor(timestamp * this.sampleRate);
	}

	/**
	 * Get average sample value at specific position
	 * @param sample number
	 * @return Average value
	 */
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
