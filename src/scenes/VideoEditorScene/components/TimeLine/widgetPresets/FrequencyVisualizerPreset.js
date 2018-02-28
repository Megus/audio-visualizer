import WidgetPresetBase from "./WidgetPresetBase";

export default class FrequencyVisualizerPreset extends WidgetPresetBase {
	static getInstance = async presetJsonFileName =>
		WidgetPresetBase.loadFromFile(
			"frequencyVisualizer",
			presetJson => new FrequencyVisualizerPreset(presetJson),
			presetJsonFileName,
		);
}
