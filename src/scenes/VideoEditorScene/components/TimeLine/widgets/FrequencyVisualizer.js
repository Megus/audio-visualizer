import WidgetBase from "./WidgetBase";

class FrequencyVisualizer extends WidgetBase {
	drawFrame = async (timestamp) => {
		console.log("FrequencyVisualizer.draw() called. Timestamp: ", timestamp);

		return Promise.resolve();
	};

	static getInstance = async (canvas, presetFactoryMethod) =>
		WidgetBase.getInstance(canvas, presetFactoryMethod, (cvs, presets) => new FrequencyVisualizer(cvs, presets));
}

export default FrequencyVisualizer;
