import {KissFFT} from "../3rdParty/kissfft/FFT.js"

class DataProvider {
	constructor(audioBuffer, fftSize = 2048) {
		this.audioBuffer = audioBuffer
		this.fftSize = fftSize
		this.sampleRate = audioBuffer.sampleRate
		this.fft = new KissFFT(fftSize)
		this.fftInArray = new Float32Array(fftSize * 2)
		this.audioLength = audioBuffer.length
		this.channels = []
	    for (var c = 0; c < audioBuffer.numberOfChannels; c++) {
	    	this.channels.push(audioBuffer.getChannelData(c))
	    }
	}

	stop() {
		this.fft.dispose()
	}

	getFrequencyArray(timestamp, dataArray) {
	    const fft = this.fft
	    const sampleStart = this.timestampToSample(timestamp) - this.fftSize / 2

	    var i = 0
	    for (var c = sampleStart; c < sampleStart + this.fftSize; c++) {
	    	this.fftInArray[i] = this.avgSampleAt(c)
	    	i += 2
	    }
	    
		var out = fft.forward(this.fftInArray);

		for (c = 0; c < this.fftSize; c++) {
			dataArray[c] = Math.sqrt(out[c*2] * out[c*2] + out[c*2+1] * out[c*2+1]) / this.fftSize
		}
	}

	getPower(timestamp) {
		var power = 0.0
		var sample = 0
		const sampleStart = this.timestampToSample(timestamp)
		for (var c = sampleStart; c < sampleStart + this.fftSize; c++) {
			sample = this.avgSampleAt(c)
			power += sample * sample
		}
		return Math.sqrt(power / this.fftSize)
	}

	getSamples(timestamp, count) {

	}

	// Public utility functions
	freqToFFTBin(freq) {
		return Math.floor(freq * this.fftSize / this.sampleRate)
	}

	timestampToSample(timestamp) {
		return Math.floor(timestamp * this.sampleRate)
	}

	avgSampleAt(sample) {
    	if (sample < 0 || sample >= this.audioLength) {
    		return 0.0
    	} else {
    		var value = 0
    		for (var c = 0; c < this.channels.length; c++) {
    			value += this.channels[c][sample]
    		}
    		return value / this.channels.length
    	}
	}
}

export default DataProvider
