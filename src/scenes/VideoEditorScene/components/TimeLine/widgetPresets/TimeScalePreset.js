import WidgetPresetBase from "./WidgetPresetBase";

class TimeScalePreset extends WidgetPresetBase {
	constructor(presetJson) {
		super(presetJson);

		// * Relative measure of time between two adjacent markers (1 - 1 sec, 5 - 5 sec, 0.5 - 30 sec ??)
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

		this.prevPresetJsonPath = presetJson.prevPresetJsonPath;
		this.thispresetJsonPath = presetJson.thispresetJsonPath;
		this.nextPresetJsonPath = presetJson.nextPresetJsonPath;
	}

	static getInstance = presetJsonFilePath =>
		WidgetPresetBase.loadFromFile(presetJsonFilePath, presetJson => new TimeScalePreset(presetJson));
}

export default TimeScalePreset;
