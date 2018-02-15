import WidgetBase from "../WidgetBase";

import divideOnEvenlyParts from "../../../../../../services/commonFunctions";

export default class TimeScale extends WidgetBase {
	defaultConsts = {
		markerHeight: 30,
		pixelsInSecond: 20,
		noAudioLoadedMessage: "No audio file loaded",
	}

	// ! TODO: Debug method. Should be removed
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
		const { canvas, mediaAudio } = this;
		const {
			pixelsInSecond,
			markerHeight,
		} = this.defaultConsts;

		if (!mediaAudio) {
			this.showNoMediaAudioLoadedMessage();
			return;
		}

		// ! TODO: Probably must not be called each time
		this.clearCanvas();

		const ctx = canvas.getContext("2d");

		const secondsInAudio = mediaAudio.audioBuffer.duration;
		const pixelsInAudio = secondsInAudio * pixelsInSecond;
		ctx.width = pixelsInAudio;
		// const markersNum = divideOnEvenlyParts(canvas.width, pixelsInSecond);
		const markersNumber = divideOnEvenlyParts(pixelsInAudio, pixelsInSecond);
		ctx.lineWidth = 1;
		ctx.beginPath();
		for (let offset = 1; offset <= markersNumber; offset += 1) {
			ctx.moveTo(pixelsInSecond * offset, 0);
			ctx.lineTo(pixelsInSecond * offset, markerHeight);

			// ? TODO: Implement calculation of accent markers
			// ctx.lineTo(xDelta * offset, (xDelta * offset) % 3 === 0 ? yAccentDelta : markerHeight);
			// console.log((xDelta * offset) % 3);

			// ! TODO: Implement time markers digits output
		}
		ctx.stroke();
		ctx.closePath();
	}
}
