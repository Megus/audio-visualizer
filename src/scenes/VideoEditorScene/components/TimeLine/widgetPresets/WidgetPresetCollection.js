import {
	throwErrorIfRequiredArgumentMissed,
	throwErrorIfArgumentIsNotFunction,
} from "../../../../../services/commonFunctions";

class WidgetPresetCollection extends Array {
	constructor(presetFactoryMethod, ...items) {
		throwErrorIfRequiredArgumentMissed({ presetFactoryMethod });
		throwErrorIfArgumentIsNotFunction({ presetFactoryMethod });

		super(...items);

		//* Workaround to force 'instanceof WidgetPresetCollection' work
		//* Refer to: https://github.com/babel/babel/issues/3083
		this.constructor = WidgetPresetCollection;
		// eslint-disable-next-line no-proto
		this.__proto__ = WidgetPresetCollection.prototype;

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
				const widgetPreset = presetJsonFileName
					? await this.presetFactoryMethod(presetJsonFileName)	// get named preset
					: await this.presetFactoryMethod();						// get default preset

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

	static getFilledInstance = async (presetFactoryMethod, ...items) => {
		const instance = new WidgetPresetCollection(presetFactoryMethod, ...items);
		await instance.fill();

		return instance;
	}
}

export default WidgetPresetCollection;
