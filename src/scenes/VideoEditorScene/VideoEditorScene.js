/* global requestAnimationFrame, FileReader */

import React, { Component } from "react";
import Whammy from "whammy";

import loadProject from "../../services/loadProject";
import createNewProject from "../../services/createNewProject";

import RenderEngine from "../../core/RenderEngine";

class VideoEditorScene extends Component {
	constructor(props) {
		super(props);

		this.renderVideo = this.renderVideo.bind(this);
		this.draw = this.draw.bind(this);
		this.onAudioPlay = this.onAudioPlay.bind(this);
		this.onAudioPause = this.onAudioPause.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.loadProject = this.loadProject.bind(this);
		this.setup = this.setup.bind(this);

		this.audioFilePath = "/project/bad-monday.mp3";

		this.state = {
			canPlay: false,
			isAnimating: false,
			isRendering: false,
		};
	}

	setup(project) {
		const canvas = this.canvasRef;

		this.renderEngine = new RenderEngine(project, canvas.width, canvas.height);
		this.setState({
			canPlay: true,
			isAnimating: true,
		});
		setTimeout(this.draw, 1);
	}

	loadProject() {
		const player = document.getElementById("player");
		player.src = this.audioFilePath;
		loadProject("/project/project.json")
			.then((project) => {
				console.log(project);
				this.setup(project);
			});
	}

	renderVideo() {
		this.videoRecorder = new Whammy.Video(60, 1.0);

		var frame = 0;

		const renderFrame = () => {
			const timestamp = frame / 60.0;
			this.draw(timestamp);
			this.videoRecorder.add(this.canvasRef);
			console.log(timestamp);
			frame++;
			if (timestamp < 5) {
				setTimeout(renderFrame, 1);
			} else {
				var output = this.videoRecorder.compile();
				var url = (window.webkitURL || window.URL).createObjectURL(output);
				this.videoRef.src = url;
			}
		}

		setTimeout(renderFrame, 1);
	}

	draw() {
		if (this.state.canPlay) {
			const canvas = this.canvasRef;
			if (this.state.canPlay) {
				this.renderEngine.drawFrame(this.canvasRef, this.audioRef.currentTime);
			}
		}

		if (this.state.isAnimating && !this.state.isRendering) {
			requestAnimationFrame(this.draw);
		}
	};

	onAudioPlay() {
		this.setState({isAnimating: true});
		setTimeout(this.draw, 0.01);
	}

	onAudioPause() {
		this.setState({isAnimating: false});
	}

	uploadFile(event) {
		const file = event.target.files[0];
		if (file.type.split("/")[0] !== "audio") {
			alert("File type not supported");
			return;
		}
		const urlFileReader = new FileReader();
		const arrayBufferFileReader = new FileReader();
		urlFileReader.onload = (e) => {
			const player = document.getElementById("player");
			player.src = e.target.result;
		};
		arrayBufferFileReader.onload = (e) => {
			const project = {
				title: file.name,
				author: "",
				arrayBuffer: e.target.result,
				media: {
					img1: "/project/cc-cover.jpeg",
				},
				layers: [
					{
						effect: "StaticImage",
						consts: {
							images: ["img1"],
						},
						vars: {
							image: 0,
						},
					},
					{
						effect: "SimpleSpectrum",
						consts: {},
						vars: {},
					},
					{
						effect: "PowerMeter",
						consts: {},
						vars: {},
					},
				],
			};
			createNewProject(project)
				.then((_project) => {
					this.setup(_project);
				});
		};
		if (file) {
			urlFileReader.readAsDataURL(file);
			arrayBufferFileReader.readAsArrayBuffer(file);
		}
	}

	render() {
		return (
			<div>
				<audio
					id="player"
					controls
					onPlay={this.onAudioPlay}
					onPause={this.onAudioPause}
					ref={(audio) => { this.audioRef = audio; }}
				/>
				<hr />
				<br />
				<button onClick={this.renderVideo}>Render</button>
				<input type="file" onChange={this.uploadFile} />
				<button onClick={this.loadProject}>Load Bad Monday</button>
				<br />
				<canvas
					width="1920"
					height="1080"
					style={{width: 960, height: 540}}
					ref={(canvas) => { this.canvasRef = canvas; }} 
				/>
				<video ref={(video) => { this.videoRef = video }} />
			</div>
		);
	}
}

export default VideoEditorScene;
