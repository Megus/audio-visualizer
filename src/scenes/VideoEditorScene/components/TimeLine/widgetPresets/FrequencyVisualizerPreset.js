import WidgetPresetBase from "./WidgetPresetBase";

export default class FrequencyVisualizerPreset extends WidgetPresetBase {
	static getInstance = async presetJsonFilePath =>
		WidgetPresetBase.loadFromFile(presetJsonFilePath, presetJson => new FrequencyVisualizerPreset(presetJson));
}
