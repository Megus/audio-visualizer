import React, { Component } from 'react';
import Whammy from "whammy";

import loadProject from "../../services/loadProject"

import RenderEngine from "../../core/RenderEngine"

class VideoEditorScene extends Component {
	constructor(props) {
		super(props)

		this.renderVideo = this.renderVideo.bind(this)
		this.draw = this.draw.bind(this)
		this.onAudioPlay = this.onAudioPlay.bind(this)
		this.onAudioPause = this.onAudioPause.bind(this)

		this.audioFilePath = "/project/bad-monday.mp3"

		this.state = {
			canPlay: false,
			isAnimating: false,
			isRendering: false,
		}
	}

	componentDidMount() {
		this.setup()
	}

	setup() {
		loadProject("/project/project.json")
			.then((project) => {
				const canvas = this.canvasRef
				this.renderEngine = new RenderEngine(project, canvas.width, canvas.height)
				this.setState({
					canPlay: true,
					isAnimating: true,
				})
				setTimeout(this.draw, 1)
			})
	}

	renderVideo() {
		this.videoRecorder = new Whammy.Video(60);
		console.log(this.videoRecorder)

		var frame = 0

		const renderFrame = () => {
			const timestamp = frame / 60.0
			this.draw(timestamp)
			this.videoRecorder.add(this.canvasRef)
			console.log(timestamp)
			frame++
			if (timestamp < 5) {
				setTimeout(renderFrame, 1)
			} else {
				var output = this.videoRecorder.compile();
				var url = (window.webkitURL || window.URL).createObjectURL(output);
				this.videoRef.src = url;
			}
		}

		setTimeout(renderFrame, 1)
	}

	draw() {
		if (this.state.canPlay) {
			const canvas = this.canvasRef

			if (this.state.canPlay) {
				this.renderEngine.drawFrame(this.canvasRef, this.audioRef.currentTime)
			}

		}

		if (this.state.isAnimating && !this.state.isRendering) {
			requestAnimationFrame(this.draw);
		}
	};

	onAudioPlay() {
		this.setState({isAnimating: true})
	}

	onAudioPause() {
		this.setState({isAnimating: false})
	}


	render() {
		return (
			<div>
				<audio
					src={this.audioFilePath}
					controls
					onPlay={this.onAudioPlay}
					onPause={this.onAudioPause}
					ref={(audio) => { this.audioRef = audio }} />
				<hr />
				<br />
				<button onClick={this.renderVideo}>Render</button>
				<br />
				<canvas width="1920" height="1080" style={{width: 960, height: 540}} ref={(canvas) => { this.canvasRef = canvas }} />
				<video ref={(video) => { this.videoRef = video }} />
			</div>
		);
	}
}

export default VideoEditorScene;
