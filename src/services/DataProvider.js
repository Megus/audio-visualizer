import {KissFFT} from "../3rdParty/kissfft/FFT.js"

class DataProvider {
	constructor(audioBuffer, fftSize = 2048) {
		this.audioBuffer = audioBuffer
		this.fftSize = fftSize
		this.sampleRate = audioBuffer.sampleRate
		this.fft = new KissFFT(fftSize)
		this.fftInArray = new Float32Array(fftSize * 2)
	}

	stop() {
		this.fft.dispose()
	}

	getFrequencyArray(timestamp, dataArray) {
	    const fft = this.fft
	    const audioLength = this.audioBuffer.length
	    const sampleStart = this.timestampToSample(timestamp) - this.fftSize / 2
	    var channels = []
	    for (var c = 0; c < this.audioBuffer.numberOfChannels; c++) {
	    	channels.push(this.audioBuffer.getChannelData(c))
	    }

	    var i = 0
		var sample = 0
		var summer = (channel) => { sample += channel[c] }
	    for (c = sampleStart; c < sampleStart + this.fftSize; c++) {
	    	if (c < 0 || c >= audioLength) {
	    		this.fftInArray[i] = 0
	    	} else {
	    		sample = 0
	    		// Avarage sample value of all channels
	    		channels.forEach(summer)
	    		this.fftInArray[i] = sample / this.audioBuffer.numberOfChannels
	    	}
	    	i += 2
	    }
	    
		var out = fft.forward(this.fftInArray);

		for (var j = 0; j < this.fftSize; j++) {
			dataArray[j] = Math.sqrt(out[j*2] * out[j*2] + out[j*2+1] * out[j*2+1]) / this.fftSize
		}
	}

	getPower(timestamp) {

	}

	getSamples(timestamp, count) {

	}

	timestampToSample(timestamp) {
		return Math.floor(timestamp * this.sampleRate)
	}
}

export default DataProvider
