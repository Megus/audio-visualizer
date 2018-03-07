import { MediaAudio } from "../../../../../core/media/index";
import { WidgetPresetCollection } from "../widgetPresets";
import {
	throwError,
	throwErrorIfRequiredArgumentMissed,
} from "../../../../../services/commonFunctions";

class WidgetBase {
	constructor(canvas, presets) {
		throwErrorIfRequiredArgumentMissed({ canvas });
		throwErrorIfRequiredArgumentMissed({ presets });

		// ? TODO: Move to separate function
		if (!(presets instanceof WidgetPresetCollection)) {
			throw new Error("'presets' argument is not an instance of WidgetPresetCollection class");
		}

		this.canvas = canvas.getContext
			? canvas
			: throwError("'canvas' argument is not an instance of Canvas");

		this.presets = presets;
		this.activePreset = presets.getDefaultPreset();

		this.mediaAudio = null;
	}

	/**
	 * Abstract methods
	 */

	// eslint-disable-next-line no-unused-vars
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
			throw new Error("'mediaAudio' argument is not MediaAudio class instance");
		}

		this.mediaAudio = value;
	}

	// eslint-disable-next-line no-unused-vars
	static getInstance = async (canvas, presetFactoryMethod, widgetConstructorCallback) =>
		widgetConstructorCallback(canvas, await WidgetPresetCollection.getFilledInstance(presetFactoryMethod));
}

export default WidgetBase;
