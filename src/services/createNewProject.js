import Project from "../core/Project";

function createNewProject(projectObject) {
	let media = {};
	let project = new Project(projectObject);

	const decodeAudio = new Promise((resolve, reject) => {
		let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		return audioCtx.decodeAudioData(project.arrayBuffer, resolve, reject);
	});

	// Load media (well, only images for now)
	// TODO: Handle other kinds of media
	// TODO: Replace static asset files with uploaded data
	const loadMedia = Object.keys(projectObject.media).map((key) =>
		fetch(projectObject.media[key])
			.then((response) => response.blob())
			.then((imageBlob) => createImageBitmap(imageBlob))
			.then((mediaObject) => { media[key] = mediaObject; }));

	return Promise.all([decodeAudio, loadMedia])
		.then((responses) => {
			// Responses contain decoded audio data and an array of all media
			project.audioBuffer = responses[0];
			project.media = media;
			project.prepare();

			return project;
	})
}

export default createNewProject;