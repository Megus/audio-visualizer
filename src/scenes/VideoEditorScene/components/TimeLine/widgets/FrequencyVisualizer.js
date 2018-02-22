import WidgetBase from "./WidgetBase";

class FrequencyVisualizer extends WidgetBase {
	drawFrame = async (timestamp) => {
		// console.log("FrequencyVisualizer.draw() called");
		return Promise.resolve();
	};
}

export default FrequencyVisualizer;
