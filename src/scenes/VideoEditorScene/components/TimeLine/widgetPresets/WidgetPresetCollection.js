import {
	throwErrorIfRequiredArgumentMissed,
	throwErrorIfArgumentIsNotFunction,
} from "../../../../../services/commonFunctions";

class WidgetPresetCollection extends Array {
	constructor(presetFactoryMethod, ...items) {
		throwErrorIfRequiredArgumentMissed({ presetFactoryMethod });
		throwErrorIfArgumentIsNotFunction({ presetFactoryMethod });

		super(...items);

		this.presetFactoryMethod = presetFactoryMethod;
	}

	getDefaultPreset = () =>
		this.find(preset =>
			preset.thisPresetFile ||
			preset.thisPresetFile
				.toLowerCase()
				.startsWith("default"));

	asHashTableBy = key =>
		this.reduce((result, preset) => ({
			...result,
			[preset[key]]: preset,
		}), {});

	fill = async () => {
		const fillThis = async (presetJsonFileName = null) => {
			try {
				const widgetPreset = !presetJsonFileName
					? await this.presetFactoryMethod()						// get default preset
					: await this.presetFactoryMethod(presetJsonFileName);	// get named preset

				this.push(widgetPreset);

				if (widgetPreset.nextPresetFile) {
					await fillThis(widgetPreset.nextPresetFile); // recursive call
				}
			} catch (error) {
				return Promise.reject(error);
			}

			return Promise.resolve();
		};

		return fillThis();
	}
}

export default WidgetPresetCollection;
