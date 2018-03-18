import WidgetPresetBase from "./WidgetPresetBase";

const INITIAL_PRESET_JSON_FILE_NAME = "default.json";

class FrequencyVisualizerPreset extends WidgetPresetBase {
	static getInstance = async (presetJsonFileName = INITIAL_PRESET_JSON_FILE_NAME) =>
		WidgetPresetBase.loadFromFile(
			"frequencyVisualizer",
			presetJson => new FrequencyVisualizerPreset(presetJson),
			presetJsonFileName,
		);
}

export default FrequencyVisualizerPreset;
