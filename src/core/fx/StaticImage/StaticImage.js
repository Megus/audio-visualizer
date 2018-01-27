import FXBase from "../FXBase";

class StaticImage extends FXBase {
	constructor(dataProvider, canvas, consts = {}, vars = {}) {
		super(dataProvider, canvas, consts, vars);
	}

	drawFrame(timestamp) {
		if (!this.consts.images) return;
		if (!this.consts.images[this.vars.image]) return;
		const image = this.provider.media[this.consts.images[this.vars.image]];
		if (!image) return;

		const canvas = this.canvas;
		const canvasCtx = canvas.getContext("2d");

		let imgH;
		let imgW;
		if (image.height >= image.width) {
			imgH = canvas.height * 0.9;
			imgW = image.width * (imgH / image.height);
		} else {
			imgW = canvas.width * 0.9;
			imgH = image.height * (imgW / image.width);
		}

		const x = (canvas.width - imgW) / 2;
		const y = (canvas.height - imgH) / 2;

		canvasCtx.drawImage(image, Math.floor(x), Math.floor(y), Math.floor(imgW), Math.floor(imgH));
	}
}

export default StaticImage;
