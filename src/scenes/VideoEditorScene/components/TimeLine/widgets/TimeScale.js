import WidgetBase from "./WidgetBase";

import { divideOnEvenlyParts, secondsToMinutesString } from "../../../../../services/commonFunctions";

class TimeScale extends WidgetBase {
	defaultConsts = {
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
		const { noAudioLoadedMessage } = this.defaultConsts;

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
		// console.log("TimeScale.draw() called");

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
		} = this.preset;

		if (!mediaAudio) {
			this.showNoMediaAudioLoadedMessage();
			return Promise.resolve();
		}

		const ctx = canvas.getContext("2d");
		// ctx.scale(0.77, 1);

		ctx.lineWidth = markerLineWidth;
		ctx.font = timeStampFont;

		const markersNumber = (mediaAudio.audioBuffer.duration / scale) + additionalMarkersQty;

		ctx.beginPath();
		for (let offset = 1; offset <= markersNumber; offset += 1) {
			ctx.moveTo(pixelsBetweenAdjMarkers * offset, 0);
			ctx.lineTo(pixelsBetweenAdjMarkers * offset, markerHeight);

			// * Сalculation of accent markers
			ctx.lineTo(pixelsBetweenAdjMarkers * offset, (pixelsBetweenAdjMarkers * offset) % accentMarkerAppearanceFreq === 0
				? accentMarkerHeight
				: markerHeight);

			// * Time markers output
			if ((pixelsBetweenAdjMarkers * offset) % accentMarkerAppearanceFreq === 0) {
				const txt = secondsToMinutesString(offset * scale);
				const txtMeasure = ctx.measureText(txt);
				ctx.fillText(txt, pixelsBetweenAdjMarkers * offset - txtMeasure.width / 2, accentMarkerHeight + timeStampFontSize);
			}
		}
		ctx.stroke();
		ctx.closePath();

		return Promise.resolve();
	}
}

export default TimeScale;
