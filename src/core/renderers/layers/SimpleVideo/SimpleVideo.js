import RendererBase from "../../RendererBase";
import { scaleImageInFrame } from "../../RendererConvenience";

class SimpleVideo extends RendererBase {
	constructor(media, canvas, consts = {}, vars = {}) {
		super(media, canvas, consts, vars);
	}

	async render(timestamp) {
		const video = this.media[this.consts.video];
		if (video) {
			let canvas = this.canvas;
			let canvasCtx = canvas.getContext("2d");

			let videoTimestamp = timestamp;
			const duration = video.video.duration;
			if (video.video.duration && this.consts.looped) {
				videoTimestamp = timestamp - Math.floor(timestamp / duration) * duration;
			}

			const image = await video.getFrame(videoTimestamp, this.consts.realtime);
			if (image) {
				const {x, y, w, h, sx, sy, sw, sh} = scaleImageInFrame(
					this.consts.scale, image.width, image.height, this.vars.frame.width, this.vars.frame.height);

				canvasCtx.drawImage(image, Math.floor(sx), Math.floor(sy), Math.floor(sw), Math.floor(sh),
					Math.floor(x + this.vars.frame.x), Math.floor(y + this.vars.frame.y), Math.floor(w), Math.floor(h));
			}
		}
	}
}

export default SimpleVideo;
