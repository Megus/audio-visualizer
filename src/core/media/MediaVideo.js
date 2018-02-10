import eventToPromise from "event-to-promise";

class MediaVideo {
	constructor(url) {
		this.video = document.createElement("video");
		this.video.src = url;
		this.video.muted = true;
		this.video.oncanplay = this.videoCanPlay.bind(this);
		this.canvas = null;
		this.width = 0;
		this.height = 0;
	}

	videoCanPlay() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = this.video.videoWidth;
		this.canvas.height = this.video.videoHeight;
		this.width = this.video.videoWidth;
		this.height = this.video.videoHeight;
	}

	async getFrame(timestamp, realtime) {
		if (realtime) {
			return this.getFrameRealtime(timestamp);
		} else {
			return this.getFrameOffline(timestamp);
		}
	}

	async getFrameRealtime(timestamp) {
		if (!this.canvas) return;
		const canvas = this.canvas;
		const canvasCtx = canvas.getContext("2d");
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
		if (!this.canvas) {
			// Okay, maybe it's not the perfect solution, but we need to wait until video is loaded
			// TODO: If there's a fatal problem with video loading, this wait loop will become infinite
			while (!this.canvas) {
				await new Promise(resolve => setTimeout(resolve, 100));
			}
		}

		const video = this.video;
		const canvas = this.canvas;
		const canvasCtx = canvas.getContext("2d");

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
