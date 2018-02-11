/* global requestAnimationFrame */

import React, { Component } from "react";
import Whammy from "whammy";
import PropTypes from "prop-types";

import RenderEngine from "../../core/RenderEngine";

class VideoRenderingScene extends Component {
	constructor(props) {
		super(props);

		this.project = props.project;

		this.renderVideo = this.renderVideo.bind(this);
		this.drawOfflineRender = this.drawOfflineRender.bind(this);
		this.stopRendering = this.stopRendering.bind(this);
		this.close = this.close.bind(this);
		this.saveRender = this.saveRender.bind(this);
		this.confirmCloseAndSave = this.confirmCloseAndSave.bind(this);

		this.state = {
			progressPercentage: 0,
		};

		setTimeout(() => {
			this.renderVideo();
		}, 0);
	}

	stopRendering() {
		this.offlineRenderEngine = null;
	}

	close() {
		this.props.onClose();
	}

	confirmCloseAndSave() {
		const reallyClose = window.confirm("Abort rendering?");
		if (reallyClose) {
			const save = window.confirm("Save partial render?");
			this.stopRendering();
			if (save) {
				this.saveRender();
			}
			this.close();
		}
	}

	saveRender() {
		const output = this.videoRecorder.compile();
		const url = (window.webkitURL || window.URL).createObjectURL(output);
		setTimeout(() => {
			const a = document.createElement("a");
			document.body.appendChild(a);
			a.style = "display: none";
			a.href = url;
			a.download = `${this.props.project.title}.webm`;
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		}, 0);
	}

	async drawOfflineRender() {
		if (this.offlineRenderEngine === null) { return; }
		const timestamp = this.renderFrame / 60.0;
		await this.offlineRenderEngine.drawFrame(this.canvasRef, timestamp);
		if (this.canvasRef === null) { return; }
		this.videoRecorder.add(this.canvasRef);
		this.renderFrame += 1;
		if (this.renderFrame % 10 === 0) {
			const progressPercentage = ((timestamp * 100) / this.props.duration).toFixed(1);
			this.setState({ progressPercentage });
		}

		if (timestamp < this.props.duration) { // replace this.props.duration with a number of seconds for testing with shorter movies
			requestAnimationFrame(this.drawOfflineRender);
		} else {
			this.stopRendering();
			this.saveRender();
			this.close();
		}
	}

	renderVideo() {
		this.offlineRenderEngine = new RenderEngine(this.project, this.canvasRef.width, this.canvasRef.height, false);
		this.videoRecorder = new Whammy.Video(60, 0.9);
		this.renderFrame = 0;
		setTimeout(this.drawOfflineRender, 1);
	}

	render() {
		return (
			<div className="modal">
				<div className="modal__overlay" onClick={this.confirmCloseAndSave} />
				<div className="modal__popup">
					<div className="modal__header">
						{this.state.progressPercentage}%
						<div
							role="button"
							tabIndex={0}
							className="modal__close-button"
							onClick={this.confirmCloseAndSave}
						/>
					</div>
					<canvas
						width="1920"
						height="1080"
						style={{ width: 960, height: 540 }}
						ref={(canvas) => { this.canvasRef = canvas; }}
					/>
				</div>
			</div>
		);
	}
}

VideoRenderingScene.propTypes = {
	project: PropTypes.shape({
		author: PropTypes.string,
		layers: PropTypes.array,
		media: PropTypes.object,
		mediaInfo: PropTypes.object,
		title: PropTypes.string,
	}).isRequired,
	duration: PropTypes.number.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default VideoRenderingScene;
