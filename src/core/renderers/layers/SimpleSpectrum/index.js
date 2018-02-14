import { ValueTypes } from "../../RendererBase";
import SimpleSpectrum from "./SimpleSpectrum";

const LSimpleSpectrum = {
	id: "org.megus.SimpleSpectrum",
	type: "layer",
	name: "Simple Spectrum",
	author: "Megus",
	thumbnail: "",
	consts: {
		barsCount: {
			title: "Spectrum bars count",
			type: ValueTypes.int,
		}
	},
	vars: {
		scale: {
			title: "Vertical scale",
			type: ValueTypes.float,
		},
		color: {
			title: "Bar color",
			type: ValueTypes.color,
		},
		fallTime: {
			title: "Bar fall time",
			type: ValueTypes.float,
		}
	},
	defaultConsts: {
		barsCount: 128,
	},
	defaultVars: {
		scale: 10,
		color: "#FF0000FF",
		fallTime: 1.5,
	},
	renderClass: SimpleSpectrum,
	//guiClass: ...
};

export default LSimpleSpectrum;