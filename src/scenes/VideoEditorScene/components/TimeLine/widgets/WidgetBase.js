export default class WidgetBase {
	constructor(canvas, audio) {
		if (canvas === undefined) {
			throw new Error("'canvas' argument is undefined");
		}

		if (audio === undefined) {
			throw new Error("'audio' argument is undefined");
		}

		if (canvas.getContext) {
			this.canvas = canvas;
		} else {
			throw new Error("'canvas' argument is null or not canvas instance");
		}

		// ! TODO: Add audio isnstance check
		this.audio = audio;
	}
}
