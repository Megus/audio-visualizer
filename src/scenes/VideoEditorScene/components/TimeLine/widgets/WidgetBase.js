import { MediaAudio } from "../../../../../core/media/index";
import { WidgetPresetCollection } from "../widgetPresets";
import {
	throwError,
	throwErrorIfRequiredArgumentMissed,
	throwErrorIfArgumentIsNotInstanceOfType,
} from "../../../../../services/commonFunctions";
import WidgetPresetBase from "../widgetPresets/WidgetPresetBase";

class WidgetBase {
	constructor(canvas, presets) {
		throwErrorIfRequiredArgumentMissed({ canvas });
		throwErrorIfRequiredArgumentMissed({ presets });
		throwErrorIfArgumentIsNotInstanceOfType({ presets }, WidgetPresetCollection);

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

	setActivePreset = (preset) => {
		throwErrorIfRequiredArgumentMissed({ preset });
		throwErrorIfArgumentIsNotInstanceOfType({ preset }, WidgetPresetBase);

		const { presets } = this;

		if (!presets || presets.length === 0) {
			return false;
		}

		const foundPreset = presets.find(p => p.id === preset.id);
		if (foundPreset) {
			this.activePreset = preset;
			return true;
		}

		return false;
	}

	setNextPresetAsActive = () => {
		const {
			presets,
			activePreset,
		} = this;

		if (!presets || presets.length === 0) {
			return false;
		}

		if (!activePreset.nextPresetExists()) {
			return false;
		}

		const nextPreset = presets.find(p => p.thisPresetFile === activePreset.nextPresetFile);
		if (nextPreset) {
			this.activePreset = nextPreset;
			return true;
		}

		return false;
	}

	setPrevPresetAsActive = () => {
		const {
			presets,
			activePreset,
		} = this;

		if (!presets || presets.length === 0) {
			return false;
		}

		if (!activePreset.prevPresetExists()) {
			return false;
		}

		const prevPreset = presets.find(p => p.thisPresetFile === activePreset.prevPresetFile);
		if (prevPreset) {
			this.activePreset = prevPreset;
			return true;
		}

		return false;
	}

	canSetNextPreset = () => this.activePreset.nextPresetExists();
	canSetPrevPreset = () => this.activePreset.prevPresetExists();

	setMediaAudio = (mediaAudio) => {
		if (mediaAudio === undefined) {
			throwError("'mediaAudio' argument is undefined");
		}

		// Can accept null
		if (mediaAudio === null) {
			this.mediaAudio = mediaAudio;
			return;
		}

		// Cannot accept instances other than MediaAudio class instance
		throwErrorIfArgumentIsNotInstanceOfType({ mediaAudio }, MediaAudio);

		this.mediaAudio = mediaAudio;
	}

	// eslint-disable-next-line no-unused-vars
	static getInstance = async (canvas, presetFactoryMethod, widgetConstructorCallback) =>
		widgetConstructorCallback(canvas, await WidgetPresetCollection.getFilledInstance(presetFactoryMethod));
}

export default WidgetBase;
