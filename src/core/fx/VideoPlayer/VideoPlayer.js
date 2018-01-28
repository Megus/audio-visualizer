import FXBase from "../FXBase";

class VideoPlayer extends FXBase {
	constructor(media, canvas, consts = {}, vars = {}) {
		super(media, canvas, consts, vars);
	}

	drawFrame(timestamp) {
		const video = this.media[this.consts.video];
		if (video) {
			let canvas = this.canvas;
			let canvasCtx = canvas.getContext("2d");

			canvasCtx.drawImage(video.getFrame(timestamp), 0, 0)
		}
	}
}

export default VideoPlayer;
