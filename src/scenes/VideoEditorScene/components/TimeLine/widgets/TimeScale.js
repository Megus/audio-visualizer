import WidgetBase from "./WidgetBase";
import { divideOnEvenlyParts, secondsToMinutesString } from "../../../../../services/commonFunctions";

class TimeScale extends WidgetBase {
	static defaultConsts = {
		noAudioLoadedMessage: "No audio file loaded",
	}

	// TODO: Debug method. Should be removed
	drawCanvasMiddleMark = (canvasMiddle) => {
		const ctx = this.canvas.getContext("2d");
		ctx.beginPath();
		ctx.moveTo(canvasMiddle, 0);
		ctx.lineTo(canvasMiddle, 10);
		ctx.stroke();
		ctx.closePath();
	}

	showNoMediaAudioLoadedMessage = () => {
		const { canvas } = this;
		const { noAudioLoadedMessage } = TimeScale.defaultConsts;

		const ctx = canvas.getContext("2d");
		ctx.font = "42px sans-serif";

		const txt = ctx.measureText(noAudioLoadedMessage);
		const canvasMiddle = divideOnEvenlyParts(canvas.width, 2);
		const txtMiddle = divideOnEvenlyParts(txt.width, 2);
		const txtXOffset = canvasMiddle - txtMiddle;

		ctx.fillText(noAudioLoadedMessage, txtXOffset, 50);

		this.drawCanvasMiddleMark(canvasMiddle);
	}

	drawFrame = async (timestamp) => {
		console.log("TimeScale.draw() called. Timestamp", timestamp);

		const { canvas, mediaAudio } = this;
		const {
			scale,
			accentMarkerAppearanceFreq,
			pixelsBetweenAdjMarkers,
			markerHeight,
			accentMarkerHeight,
			additionalMarkersQty,
			markerLineWidth,
			timeStampFontSize,
			timeStampFont,
		} = this.activePreset;

		if (!mediaAudio) {
			this.showNoMediaAudioLoadedMessage();
			return Promise.resolve();
		}

		const ctx = canvas.getContext("2d");
		// ctx.scale(0.77, 1); // * Possible usefule function

		ctx.lineWidth = markerLineWidth;
		ctx.font = timeStampFont;

		const markersNumber = Math.floor(mediaAudio.audioBuffer.duration / scale) + additionalMarkersQty;

		ctx.beginPath();
		for (let offset = 1; offset <= markersNumber; offset += 1) {
			// * Calculate if marker is accent
			const isAccesntMarker = offset % accentMarkerAppearanceFreq === 0;

			// * Regular and accent markers output
			ctx.moveTo(pixelsBetweenAdjMarkers * offset, 0);
			ctx.lineTo(pixelsBetweenAdjMarkers * offset, isAccesntMarker
				? accentMarkerHeight
				: markerHeight);

			// * Time stamps output
			if (isAccesntMarker) {
				const txt = secondsToMinutesString(offset * scale);
				const txtMeasure = ctx.measureText(txt);
				ctx.fillText(txt, pixelsBetweenAdjMarkers * offset - txtMeasure.width / 2, accentMarkerHeight + timeStampFontSize);
			}
		}
		ctx.stroke();
		ctx.closePath();

		return Promise.resolve();
	}

	static getInstance = async (canvas, presetFactoryMethod) =>
		WidgetBase.getInstance(canvas, presetFactoryMethod, (cvs, presets) => new TimeScale(cvs, presets));
}

export default TimeScale;
