import eventToPromise from "event-to-promise";

class MediaVideo {
	constructor(url) {
		this.video = document.createElement("video");
		this.video.src = url;
		this.video.muted = true;

		this.canvas = document.createElement("canvas");
		this.canvas.width = 1280;
		this.canvas.height = 720;
	}

	async getFrame(timestamp, realtime) {
		if (realtime) {
			return this.getFrameRealtime(timestamp);
		} else {
			return this.getFrameOffline(timestamp);
		}
	}

	async getFrameRealtime(timestamp) {
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

	async getFrameOffline(timestamp) {
		const video = this.video;
		let canvas = this.canvas;
		let canvasCtx = canvas.getContext("2d");

		if (!video.paused) {
			video.pause();
		}

		const videoTime = Math.min(timestamp, video.duration);
		const currentTime = video.currentTime;

		if (Math.abs(videoTime - currentTime) > 0.01) {
			video.currentTime = videoTime;
			await eventToPromise(video, "seeked");
		}
		canvasCtx.drawImage(video, 0, 0);

		return canvas;
	}
}

export default MediaVideo;
