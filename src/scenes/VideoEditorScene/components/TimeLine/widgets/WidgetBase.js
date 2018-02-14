import { MediaAudio } from "../../../../../core/media/index";

export default class WidgetBase {
	constructor(canvas) {
		if (canvas === undefined) {
			throw new Error("'canvas' argument is undefined");
		}

		if (canvas.getContext) {
			this.canvas = canvas;
		} else {
			throw new Error("'canvas' argument is null or not canvas instance");
		}

		this.mediaAudio = null;
	}

	/**
	 * Abstract methods
	 */

	// eslint-disable-next-line no-unused-vars, class-methods-use-this
	drawFrame = async (timestamp) => {
		await Promise.reject(new Error("WidgetBase.drawFrame() is abstract method. Must be Impelemented in descendandts"));
	};

	/**
	 * Base methods
	 */

	setMediaAudio = (mediaAudio) => {
		if (mediaAudio === undefined) {
			throw new Error("'mediaAudio' argument is undefined");
		}

		// Can accept null, but cannot accept instances other than MediaAudio class instance
		if (mediaAudio !== null && !(mediaAudio instanceof MediaAudio)) {
			throw new Error("'mediaAudio' argument is null or not MediaAudio class instance");
		}

		this.mediaAudio = mediaAudio;
	}

	clearCanvas = () => {
		const { canvas } = this;

		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
}
