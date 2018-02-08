import FXBase from "../FXBase";

class StaticImage extends FXBase {
	constructor(media, canvas, consts = {}, vars = {}) {
		super(media, canvas, consts, vars);
		this.oldImage = null;
	}

	async drawFrame(timestamp) {
		if (this.vars.image !== this.oldImage) {
			if (!this.consts.images) return;
			if (!this.consts.images[this.vars.image]) return;
			const image = this.media[this.consts.images[this.vars.image]].image;
			if (!image) return;

			const canvas = this.canvas;
			const canvasCtx = canvas.getContext("2d");

			canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

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
			this.oldImage = this.vars.image;
		}
	}
}

export default StaticImage;
