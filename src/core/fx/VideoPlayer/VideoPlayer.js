import FXBase from "../FXBase";

class VideoPlayer extends FXBase {
	constructor(dataProvider, canvas, consts = {}, vars = {}) {
		super(dataProvider, canvas, consts, vars);
	}

	drawFrame(timestamp) {
		let canvas = this.canvas
		let canvasCtx = canvas.getContext("2d");
		const video = this.vars.video

		const videoTime = Math.min(timestamp, video.duration)

		// Determine video state: playing or paused
		if (this.lastTimestamp == timestamp) {
			video.pause()
		} else if (video.paused && videoTime < video.duration) {
			video.play()
		}

		if (Math.abs(videoTime - video.currentTime) > 1.0) {
			this.vars.video.currentTime = videoTime
		}

		canvasCtx.drawImage(this.vars.video, 0, 0)

		this.lastTimestamp = timestamp
	}
}

export default VideoPlayer;
