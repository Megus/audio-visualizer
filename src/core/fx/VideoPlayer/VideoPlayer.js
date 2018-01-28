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

			let videoTimestamp = timestamp;
			const duration = video.video.duration;
			if (video.video.duration && this.consts.looped) {
				videoTimestamp = timestamp - Math.floor(timestamp / duration) * duration;
			}

			canvasCtx.drawImage(video.getFrame(videoTimestamp), 0, 0)
		}
	}
}

export default VideoPlayer;
