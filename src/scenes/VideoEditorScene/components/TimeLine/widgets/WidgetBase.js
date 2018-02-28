import { MediaAudio } from "../../../../../core/media/index";
import WidgetPresetBase from "../widgetPresets/WidgetPresetBase";

class WidgetBase {
	constructor(canvas, preset) {
		if (canvas === undefined) {
			throw new Error("'canvas' argument is undefined");
		}

		if (preset === undefined) {
			throw new Error("'preset' argument is undefined");
		}

		if (canvas.getContext) {
			this.canvas = canvas;
		} else {
			throw new Error("'canvas' argument is null or not canvas instance");
		}

		if (preset === null || !(preset instanceof WidgetPresetBase)) {
			throw new Error("'preset' argument is null or not widget preset class instance");
		}

		this.mediaAudio = null;

		this.presets = [];
		this.activePreset = preset;
	}

	/**
	 * Abstract methods
	 */

	// eslint-disable-next-line no-unused-vars, class-methods-use-this
	drawFrame = async timestamp =>
		Promise.reject(new Error("WidgetBase.drawFrame() is abstract method. Must be called for descendandts"));

	/**
	 * Base methods
	 */

	setMediaAudio = (value) => {
		if (value === undefined) {
			throw new Error("'mediaAudio' argument is undefined");
		}

		// Can accept null, but cannot accept instances other than MediaAudio class instance
		if (value !== null && !(value instanceof MediaAudio)) {
			throw new Error("'mediaAudio' argument not MediaAudio class instance");
		}

		this.mediaAudio = value;
	}
}

export default WidgetBase;
