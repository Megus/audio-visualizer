import AnalyserBase from "../AnalyserBase"

class StaticImage extends AnalyserBase {
	constructor(dataProvider, canvas, consts = {}, vars = {}) {
		super(dataProvider, canvas, consts, vars)
	}

	drawFrame(timestamp) {
		if (!this.consts.images) return
		if (!this.consts.images[this.vars.image]) return
        const image = this.provider.media[this.consts.images[this.vars.image]]
    	if (!image) return

        let canvas = this.canvas
        let canvasCtx = canvas.getContext("2d");

        var imgH
        var imgW
        if (image.height >= image.width) {
        	imgH = canvas.height * 0.9
        	imgW = image.width * (imgH / image.height)
        } else {
        	imgW = canvas.width * 0.9
        	imgH = image.height * (imgW / image.width)
        }

        const x = (canvas.width - imgW) / 2
        const y = (canvas.height - imgH) / 2

        canvasCtx.drawImage(image, x, y, imgW, imgH)
	}
}

export default StaticImage