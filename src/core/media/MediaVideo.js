class MediaVideo {
	constructor(url) {
		this.video = document.createElement("video");
		this.video.src = url;
		this.video.muted = true;

		this.canvas = document.createElement("canvas");
		this.canvas.width = 1280;
		this.canvas.height = 720;
	}

	getFrame(timestamp) {
		let canvas = this.canvas;
		let canvasCtx = canvas.getContext("2d");
		const video = this.video;

		const videoTime = Math.min(timestamp, video.duration);

		// Determine video state: playing or paused
		if (this.lastTimestamp === timestamp) {
			video.pause();
		} else if (video.paused && videoTime < video.duration) {
			video.play();
		}

		if (Math.abs(videoTime - video.currentTime) > 0.1) {
			video.currentTime = videoTime;
		}

		canvasCtx.drawImage(this.video, 0, 0);

		this.lastTimestamp = timestamp;

		return this.canvas;
	}
}

export default MediaVideo;
