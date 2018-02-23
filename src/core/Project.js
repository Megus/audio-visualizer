class Project {
	constructor(projectJson) {
		this.title = projectJson.title;
		this.author = projectJson.author;
		this.mediaInfo = projectJson.media;
		this.backgroundColor = projectJson.backgroundColor;
		this.mainGroup = projectJson.mainGroup;
	}

	prepare() {
		// Do we still need it?
	}
}

export default Project;
