class Project {
	constructor(projectJson) {
		this.title = projectJson.title;
		this.author = projectJson.author;
		this.mediaInfo = projectJson.media;
		this.layers = projectJson.layers;
	}

	prepare() {
		// Do we still need it?
	}
}

export default Project;
