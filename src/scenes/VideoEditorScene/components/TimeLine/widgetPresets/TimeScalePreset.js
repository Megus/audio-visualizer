import WidgetPresetBase from "./WidgetPresetBase";

const INITIAL_PRESET_JSON_FILE_NAME = "initial.json";

class TimeScalePreset extends WidgetPresetBase {
	constructor(presetJson) {
		super(presetJson);

		// * Relative measure of time between two adjacent markers (1 - 1 sec, 5 - 5 sec, 0.5 - 0.5 sec)
		this.scale = presetJson.scale;
		// Frequency of accent marker appearance
		this.accentMarkerAppearanceFreq = presetJson.accentMarkerAppearanceFreq;
		// Number of pixels between two adjacent markers
		this.pixelsBetweenAdjMarkers = presetJson.pixelsBetweenAdjMarkers;

		this.markerHeight = presetJson.markerHeight;
		this.accentMarkerHeight = presetJson.accentMarkerHeight;
		this.additionalMarkersQty = presetJson.additionalMarkersQty;
		this.markerLineWidth = presetJson.markerLineWidth;

		this.timeStampFontSize = presetJson.timeStampFontSize;
		this.timeStampFont = `bold ${presetJson.timeStampFontSize}px sans-serif`;
	}

	static getInstance = async (presetJsonFileName = INITIAL_PRESET_JSON_FILE_NAME) =>
		WidgetPresetBase.loadFromFile(
			"timeScale",
			presetJson => new TimeScalePreset(presetJson),
			presetJsonFileName,
		);
}

export default TimeScalePreset;
