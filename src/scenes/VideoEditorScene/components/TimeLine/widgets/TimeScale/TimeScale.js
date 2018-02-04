import WidgetBase from "../WidgetBase";

export default class TimeScale extends WidgetBase {
	// constructor(canvas, media) {
	// 	super(canvas, media);
	// }

	// testSpread = (...args) => {
	// 	[this.a] = args;
	// 	console.log(this.a);
	// };

	// this.testSpread("canvVal", 1, false);

	getTimeMarkersNumber = (canvasWidth, xDelta) =>
		(canvasWidth - canvasWidth % xDelta) / xDelta;

	draw() {
		const baseWidth = 3840;

		const ctx = this.canvas.getContext("2d");

		const xDelta = 50;
		const yDelta = 25;
		// const yAccentDelta = yDelta * 2;
		const markersNum = this.getTimeMarkersNumber(baseWidth, xDelta);
		ctx.lineWidth = 2;
		ctx.beginPath();
		for (let offset = 1; offset <= markersNum; offset += 1) {
			ctx.moveTo(xDelta * offset, 0);
			ctx.lineTo(xDelta * offset, yDelta);

			// ? TODO: Implement calculation of accent markers
			// ctx.lineTo(xDelta * offset, (xDelta * offset) % 3 === 0 ? yAccentDelta : yDelta);
			// console.log((xDelta * offset) % 3);

			// ! TODO: Implement time markers digits output
		}
		ctx.stroke();
		ctx.closePath();
	}
}
