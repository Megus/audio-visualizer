import Project from "../core/Project"

function loadProject(projectURL) {
	var project
	var media = {}
	return fetch(projectURL)
		.then((response) => response.json())
		.then((projectJson) => {
			project = new Project(projectJson)

			// Load audio file
					const loadAudio = fetch(project.audioFileUrl)
							.then((response) => {
									// Get mp3 data as ArrayBuffer
									return response.arrayBuffer()
							})
							.then((fileData) => {
									// Decode mp3 to PCM ArrayBuffer
									var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
									return new Promise((resolve, reject) => {
											audioCtx.decodeAudioData(fileData, resolve, reject) 
									})
							})

			// Load media (well, only images for now)
			// TODO: Handle other kinds of media
			const loadMedia = Object.keys(projectJson.media).map((key) =>
				fetch(projectJson.media[key])
								.then((response) => response.blob())
								.then((imageBlob) => createImageBitmap(imageBlob))
								.then((mediaObject) => media[key] = mediaObject))

			return Promise.all([loadAudio, loadMedia])
		})
		.then((responses) => {
			// Responses contain decoded audio data and an array of all media
			project.audioBuffer = responses[0]
			project.media = media
			project.prepare()

			return project
		})
		.catch((error) => {
			console.error("Failed to load project")
			console.error(error)
		})
}

export default loadProject