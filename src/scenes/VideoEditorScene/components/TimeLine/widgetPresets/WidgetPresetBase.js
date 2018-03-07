/* global fetch */

import { throwErrorIfRequiredArgumentMissed } from "../../../../../services/commonFunctions";

export default class WidgetPresetBase {
	constructor(presetJson) {
		throwErrorIfRequiredArgumentMissed({ presetJson });

		this.id = presetJson.id;
		this.name = presetJson.name;

		this.prevPresetFile = presetJson.prevPresetFile;
		this.thisPresetFile = presetJson.thisPresetFile;
		this.nextPresetFile = presetJson.nextPresetFile;
	}

	/**
	 * Abstract methods
	 */

	// eslint-disable-next-line no-unused-vars
	static getInstance = presetJsonFileName =>
		Promise.reject(new Error("WidgetPresetBase.getInstance() is abstract static method. Must be called for descendandts"));

	/**
	 * Base methods
	 */

	static loadFromFile = async (widgetName, presetConstructorCallback, presetJsonFileName = "default.json") => {
		throwErrorIfRequiredArgumentMissed({ widgetName });
		throwErrorIfRequiredArgumentMissed({ presetConstructorCallback });
		throwErrorIfRequiredArgumentMissed({ presetJsonFileName });

		const presetJsonFilePath = `presets/timeLineWidgets/${widgetName}/${presetJsonFileName}`;

		return fetch(presetJsonFilePath)
			.then(response => response.json())
			.then(json => presetConstructorCallback(json))
			.catch(error => new Error(`Cannot load TimeLine widget preset. Error: ${error}`));
	}
}
