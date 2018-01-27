import DataProvider from "./DataProvider";

class Project {
	constructor(projectJson) {
		this.title = projectJson.title;
		this.author = projectJson.author;
		this.audioFileUrl = projectJson.audioFile;
		this.mediaUrls = projectJson.media;
		this.layers = projectJson.layers;
		this.arrayBuffer = projectJson.arrayBuffer;
	}

	prepare() {
		this.dataProvider = new DataProvider(this, 8192);
	}
}

export default Project;
