/* global fetch */

import { throwErrorIfRequiredArgumentMissed } from "../../../../../services/commonFunctions";

export default class WidgetPresetBase {
	constructor(presetJson) {
		throwErrorIfRequiredArgumentMissed({ presetJson });

		this.id = presetJson.id;
		this.name = presetJson.name;
	}

	/**
	 * Base methods
	 */

	static loadFromFile(presetJsonFilePath, constructorCallback) {
		throwErrorIfRequiredArgumentMissed({ presetJsonFilePath });
		throwErrorIfRequiredArgumentMissed({ constructorCallback });

		return fetch(presetJsonFilePath)
			.then(response => response.json())
			.then(json => constructorCallback(json));
	}
}
