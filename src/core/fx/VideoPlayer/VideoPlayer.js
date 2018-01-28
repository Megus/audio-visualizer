import FXBase from "../FXBase";

class VideoPlayer extends FXBase {
	constructor(dataProvider, canvas, consts = {}, vars = {}) {
		super(dataProvider, canvas, consts, vars);
	}

	drawFrame(timestamp) {
		const canvas = this.canvas;
		const canvasCtx = canvas.getContext("2d");
	}
}

export default VideoPlayer;
