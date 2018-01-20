import SimpleSpectrum from "../analysers/SimpleSpectrum"
import StaticImage from "../analysers/StaticImage"
import PowerMeter from "../analysers/PowerMeter"

const layerClasses = { SimpleSpectrum, StaticImage, PowerMeter }

class RenderEngine {
	constructor(project, width, height) {
		this.project = project
		this.width = width
		this.height = height

		this.canvas = document.createElement("canvas")
		this.canvas.width = width
		this.canvas.height = height
		this.layers = project.layers.map((layer) => {
			return new layerClasses[layer.effect](project.dataProvider, this.canvas, layer.consts, layer.vars)
		})
	}

	drawFrame(canvas, timestamp) {
		const canvasCtx = canvas.getContext("2d");
		const offscreenCanvasCtx = this.canvas.getContext("2d")

		offscreenCanvasCtx.fillStyle = 'rgb(0, 0, 0)';
		offscreenCanvasCtx.fillRect(0, 0, canvas.width, canvas.height);

		this.layers.forEach((layer) => { layer.drawFrame(timestamp) })
		const image = offscreenCanvasCtx.getImageData(0, 0, this.width, this.height)
		canvasCtx.putImageData(image, 0, 0)
	}
}

export default RenderEngine