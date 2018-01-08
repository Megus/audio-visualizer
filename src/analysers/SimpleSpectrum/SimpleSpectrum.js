class SimpleSpectrum {
	constructor(dataProvider, canvas) {
		// Analyzer Configuration
		this.barsCount = 128	// 128 bars
		this.scale = 1.5		// Power scale
		this.height = 0.2		// 20%
		this.fallTime = 1.5		// 2 seconds for full release

		// Setup
		this.provider = dataProvider
		this.canvas = canvas

		// Prepare arrays
		this.bufferLength = dataProvider.fftSize / 2
		this.dataArray = new Float32Array(this.bufferLength)
		this.bars = new Float32Array(this.barsCount)

		// Canvas-related size calculations
		this.barWidth = canvas.width / this.barsCount
		this.maxBarHeight = canvas.height * this.height
		this.powerMultiplier = canvas.height * this.scale

		// Calculate FFT bins for bars
		var barBins = []

		var maxFreq = dataProvider.sampleRate / 2
		var curBin = this.freqToBin(40)
		var maxBin = this.freqToBin(maxFreq * 0.9)
		var binMultiplier = Math.pow(maxBin / curBin, 1.0 / this.barsCount)

		for (var c = 0; c <= this.barsCount; c++) {
			barBins.push(curBin)
			curBin *= binMultiplier
		}

		this.barBins = barBins
		this.lastTimestamp = 0
	}

	freqToBin(freq) {
		return Math.floor(freq * this.provider.fftSize / this.provider.sampleRate)
	}

    drawFrame(timestamp) {
        let canvas = this.canvas
        let canvasCtx = canvas.getContext("2d");

        this.provider.getFrequencyArray(timestamp, this.dataArray);

        var barHeight;
        var x = 0;

        for (var i = 0; i < this.barsCount; i++) {
        	// Calculate bar height
    		if (Math.floor(this.barBins[i]) < Math.floor(this.barBins[i + 1])) {
    			barHeight = 0
    			for (var c = Math.floor(this.barBins[i]); c < Math.floor(this.barBins[i + 1]); c++) {
    				barHeight += this.dataArray[c]
    			}
    		} else {
        		barHeight = this.dataArray[Math.floor(this.barBins[i])] + 
        			(this.barBins[i] - Math.floor(this.barBins[i])) *
        			(this.dataArray[Math.floor(this.barBins[i]) + 1] - this.dataArray[Math.floor(this.barBins[i])])
    		}

            barHeight *= this.powerMultiplier;

            if (barHeight > this.maxBarHeight) {
                barHeight = this.maxBarHeight
            }

            // Bars falling
            if (this.bars[i] < barHeight) {
            	this.bars[i] = barHeight
            } else {
            	this.bars[i] = Math.max(this.bars[i] - this.maxBarHeight * (timestamp - this.lastTimestamp) / this.fallTime, barHeight)
            }

            canvasCtx.fillStyle = 'rgb(255,50,50)';
            canvasCtx.fillRect(x, canvas.height - this.bars[i], this.barWidth - 1, this.bars[i]);

            x += this.barWidth;
        }

        this.lastTimestamp = timestamp
    }
}

export default SimpleSpectrum