import { MediaAudio } from "../../../../../core/media/index";

export default class WidgetBase {
	constructor(canvas, mediaAudio) {
		if (canvas === undefined) {
			throw new Error("'canvas' argument is undefined");
		}

		if (canvas.getContext) {
			this.canvas = canvas;
		} else {
			throw new Error("'canvas' argument is null or not canvas instance");
		}

		if (mediaAudio === undefined) {
			throw new Error("'mediaAudio' argument is undefined");
		}

		if (mediaAudio !== null && !(mediaAudio instanceof MediaAudio)) {
			throw new Error("'mediaAudio' argument is null or not MediaAudio class instance");
		}

		// Can be null
		this.mediaAudio = mediaAudio;
	}

	/*
	 * Abstract methods
	 */

	// eslint-disable-next-line no-unused-vars, class-methods-use-this
	async drawFrame(timestamp) {
		return Promise.reject(new Error("Abstract method. Must be Impelemented in descendandts"));
	}
}
