/* global fetch, createImageBitmap */
import Project from "../core/Project";
import { MediaAudio, MediaImage, MediaVideo } from "../core/media";

function loadAudio(url) {
	return fetch(url)
		.then(response => response.arrayBuffer())
		.then((fileData) => {
			// Decode mp3 to PCM ArrayBuffer
			const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
			return new Promise((resolve, reject) => {
				audioCtx.decodeAudioData(fileData, resolve, reject);
			});
		})
		.then(audioBuffer => new MediaAudio(audioBuffer));
};

function loadImage(url) {
	return fetch(url)
		.then(response => response.blob())
		.then(imageBlob => createImageBitmap(imageBlob))
		.then(imageBitmap => new MediaImage(imageBitmap));
};

function loadVideo(url) {
	return new Promise((resolve, reject) => {
		resolve(new MediaVideo(url));
	});
};

const mediaLoaders = {
	"audio": loadAudio,
	"image": loadImage,
	"video": loadVideo,
};


function loadProject(projectURL) {
	let project;
	const media = {};
	return fetch(projectURL)
		.then(response => response.json())
		.then((projectJson) => {
			project = new Project(projectJson);

			const loadMedia = Object.keys(projectJson.media).map((key) => {
				const loader = mediaLoaders[projectJson.media[key].type];
				if (loader) {
					return loader(projectJson.media[key].url)
						.then((mediaItem) => { media[key] = mediaItem });
				} else {
					return null;
				}
			});
			return Promise.all(loadMedia);
		})
		.then((responses) => {
			// Responses contain decoded audio data and an array of all media
			project.media = media;
			project.prepare();
			return project;
		});
}

export default loadProject;
