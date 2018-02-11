import FXBase from "../FXBase";
import { scaleImageInFrame } from "../FXConvenience";

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

			const imgW = image.width;
			const imgH = image.height;
			const {x, y, w, h, sx, sy, sw, sh} = scaleImageInFrame(
				this.consts.scale, imgW, imgH, this.vars.frame.width, this.vars.frame.height);

			canvasCtx.drawImage(image, Math.floor(sx), Math.floor(sy), Math.floor(sw), Math.floor(sh),
				Math.floor(x + this.vars.frame.x), Math.floor(y + this.vars.frame.y), Math.floor(w), Math.floor(h));
			this.oldImage = this.vars.image;
		}
	}
}

export default StaticImage;
