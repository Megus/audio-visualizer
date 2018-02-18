import WidgetPresetBase from "./WidgetPresetBase";

class TimeScalePreset extends WidgetPresetBase {
	constructor() {
		super();

		this.id = 0;
		this.name = "5 seconds";

		this.scale = 5; // * Relative measure of time between two adjacent markers (1 - 1 sec, 5 - 5 sec, 0.5 - 30 sec ??)
		this.accentMarkerAppearanceFreq = 3; // Frequency of accent marker appearance
		this.pixelsBetweenAdjMarkers = 50; // Number of pixels between two adjacent markers

		this.markerHeight = 20;
		this.accentMarkerHeight = 30;
		this.additionalMarkersQty = 2;
		this.markerLineWidth = 1;

		this.timeStampFontSize = 24;
		this.timeStampFont = `bold ${this.timeStampFontSize}px sans-serif`;

		// this.prevPresetJsonPath = null;
		// this.thispresetJsonPath = null;
		// this.nextPresetJsonPath = null;
	}
}

export default TimeScalePreset;
