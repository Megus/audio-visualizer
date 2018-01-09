import AnalyserBase from "../AnalyserBase"

class SimpleSpectrum extends AnalyserBase {
	getDefaultConsts() {
		return {
			barsCount: 128,		// Number of spectrum bars
		}
	}

	getDefaultVars() {
		return {
			scale: 1.5,			// Power multiplier
			height: 0.2,		// Spectrum height in percents of canvas height
			fallTime: 1.5,		// Seconds for a bar to fall to zero
		}
	}

	constructor(dataProvider, canvas, consts = {}, vars = {}) {
		super(dataProvider, canvas, consts, vars)

		const barsCount = this.consts.barsCount

		// Prepare arrays
		this.bufferLength = dataProvider.fftSize / 2
		this.dataArray = new Float32Array(this.bufferLength)
		this.bars = new Float32Array(barsCount)
		this.barWidth = canvas.width / barsCount

		// Calculate FFT bins for bars
		var barBins = []

		var maxFreq = dataProvider.sampleRate / 2
		var curBin = dataProvider.freqToFFTBin(40)
		var maxBin = dataProvider.freqToFFTBin(maxFreq * 0.9)
		var binMultiplier = Math.pow(maxBin / curBin, 1.0 / barsCount)

		for (var c = 0; c <= barsCount; c++) {
			barBins.push(curBin)
			curBin *= binMultiplier
		}

		this.barBins = barBins
		this.lastTimestamp = 0

		this.setupForVars()
	}

	setupForVars() {
		this.maxBarHeight = this.canvas.height * this.vars.height
		this.powerMultiplier = this.canvas.height * this.vars.scale
		// Trim bars height
		for (var c = 0; c < this.consts.barsCount; c++) {
			this.bars[c] = Math.min(this.maxBarHeight, this.bars[c])
		}
	}

    drawFrame(timestamp) {
        let canvas = this.canvas
        let canvasCtx = canvas.getContext("2d");

        this.provider.getFrequencyArray(timestamp, this.dataArray);

        var barHeight;
        var x = 0;

        for (var i = 0; i < this.consts.barsCount; i++) {
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
            	this.bars[i] = Math.max(this.bars[i] - this.maxBarHeight * Math.abs(timestamp - this.lastTimestamp) / this.vars.fallTime, barHeight)
            }

            canvasCtx.fillStyle = 'rgb(255,50,50)';
            canvasCtx.fillRect(x, canvas.height - this.bars[i], this.barWidth - 1, this.bars[i]);

            x += this.barWidth;
        }

        this.lastTimestamp = timestamp
    }
}

export default SimpleSpectrum